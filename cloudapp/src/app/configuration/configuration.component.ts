import { Component, Injectable, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService, CloudAppConfigService, CloudAppEventsService, CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AppService } from '../app.service';
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
    this.configService.getAsFormGroup().subscribe(config => {
      if (Object.keys(config.value).length != 0) {
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
      () => this.saving = false
    );
  }

}

@Injectable({
  providedIn: 'root',
})
export class ConfigurationGuard {

  constructor(
    private eventsService: CloudAppEventsService,
    private restService: CloudAppRestService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> {
    return this.eventsService.getInitData().pipe(
      switchMap(initData => this.restService.call(`/users/${initData.user.primaryId}`)),
      map(user => {
        if (!user.user_role.some(role => role.role_type.value == '221')) {
          this.router.navigate(['/error'],
            { queryParams: { error: ErrorMessages.NO_ACCESS } });
          return false;
        }
        return true;
      })
    );
  }

}