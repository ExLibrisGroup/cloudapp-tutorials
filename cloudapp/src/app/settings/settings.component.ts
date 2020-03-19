import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FormGroup } from '@angular/forms';
import { CloudAppSettingsService, FormGroupUtil } from '@exlibris/exl-cloudapp-angular-lib';
import { ToastrService } from 'ngx-toastr';
import { Settings } from '../models/settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  form: FormGroup;
  saving = false;

  constructor(
    private appService: AppService,
    private settingsService: CloudAppSettingsService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.appService.setTitle('Settings');
    this.settingsService.getAsFormGroup().subscribe( settings => {
      this.form = Object.keys(settings.value).length==0 ?
        FormGroupUtil.toFormGroup(new Settings()) :
        settings;
    });
  }

  save() {
    this.saving = true;
    this.settingsService.set(this.form.value).subscribe(
      response => {
        this.toastr.success('Settings successfully saved.');
        this.form.markAsPristine();
      },
      err => this.toastr.error(err.message),
      ()  => this.saving = false
    );
  }

}
