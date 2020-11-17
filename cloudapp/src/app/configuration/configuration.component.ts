import { Component, OnInit, Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CloudAppConfigService, CloudAppEventsService, CloudAppRestService, InitData, AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { CanActivate, Router } from '@angular/router';
import { Observable, iif, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ErrorMessages } from '../static/error.component';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  form: FormGroup;
  saving = false;
  
  constructor(
    private appService: AppService,
    private fb: FormBuilder,
    private configService: CloudAppConfigService,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.appService.setTitle('Configuration');
    this.form = this.fb.group({
      serviceUrl: this.fb.control('')
    });
    this.load();
  }

  load() {
    this.configService.getAsFormGroup().subscribe( config => {
      if (Object.keys(config.value).length!=0) {
        this.form = config;
      }
    });   
  }

  save() {
    this.saving = true;
    this.configService.set(this.form.value).subscribe(
      () => {
        this.alert.success('Configuration successfully saved.');
        this.form.markAsPristine();
      },
      err => this.alert.error(err.message),
      ()  => this.saving = false
    );
  }  

}

@Injectable({
  providedIn: 'root',
})
export class ConfigurationGuard implements CanActivate {
  constructor (
    private eventsService: CloudAppEventsService,
    private restService: CloudAppRestService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.eventsService.getInitData().pipe(
      /* Until primaryId is available: */
      switchMap(data => iif(() => 
        data.user.primaryId==null,
        this.restService.call(`/users?q=${query(data)}`).pipe(
          map( resp => resp.user[0].primary_id )
        ),
        of(data.user.primaryId)
      )),
      switchMap( primaryId => this.restService.call(`/users/${primaryId}`)),
      map( user => {
        if (!user.user_role.some(role=>role.role_type.value=='221')) {
          this.router.navigate(['/error'], 
            { queryParams: { error: ErrorMessages.NO_ACCESS }});
          return false;
        }
        return true;
      })
    );
  }
}

const query = (data: InitData) => `first_name~${q(data.user.firstName)}+AND+last_name~${q(data.user.lastName)}`;
const q = val => encodeURIComponent(val.replace(' ', '+'));