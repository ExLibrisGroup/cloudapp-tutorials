import { Component, OnInit, Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CloudAppConfigService, CloudAppEventsService, CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';
import { ToastrService } from 'ngx-toastr';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
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
    private toastr: ToastrService
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
        this.toastr.success('Configuration successfully saved.');
        this.form.markAsPristine();
      },
      err => this.toastr.error(err.message),
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
      map( data => `first_name~${encodeURIComponent(data.user.firstName.replace(' ', '+'))}+AND+last_name~${encodeURIComponent(data.user.lastName.replace(' ','+'))}`),
      flatMap( query => this.restService.call(`/users?q=${query}`)),
      map( resp => resp.user[0].primary_id ),
      // map( data => data.user.primaryId ),
      flatMap( primaryId => this.restService.call(`/users/${primaryId}`)),
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
