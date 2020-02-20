import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CloudAppSettingsService } from '@exlibris/exl-cloudapp-angular-lib';
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
    private fb: FormBuilder,
    private settingsService: CloudAppSettingsService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.appService.setTitle('Settings');
    this.form = this.fb.group({
      showValue: this.fb.control(false),
      pageSize: this.fb.control(10)
    });
    //this.settingsService.remove().subscribe(()=>this.load());
    this.load();
  }

  load() {
    this.settingsService.getAsFormGroup().subscribe( settings => {
      if (Object.keys(settings.value).length!=0) {
        this.form = settings;
      }
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
