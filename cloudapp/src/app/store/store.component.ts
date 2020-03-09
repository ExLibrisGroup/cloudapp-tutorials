import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { CloudAppStoreService } from '@exlibris/exl-cloudapp-angular-lib';
import { toFormGroup } from '../utils';

const FORM_NAME = 'StoreForm';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.scss']
})
export class StoreComponent implements OnInit {
  form: FormGroup;
  
  constructor(
    private appService: AppService,
    private storeService: CloudAppStoreService
  ) { }

  ngOnInit() {
    this.appService.setTitle('Store Service');
    this.form = new FormGroup({
      content: new FormControl()
    });

    this.storeService.get(FORM_NAME).subscribe( value => {
      if (value) {
        this.form = toFormGroup(value);
      }

      this.form.valueChanges.pipe(
        debounceTime(500), 
        switchMap(val=>this.storeService.set(FORM_NAME, val))
      ).subscribe()
    })
  }
}
