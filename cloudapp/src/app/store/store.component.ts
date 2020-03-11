import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, switchMap } from 'rxjs/operators';
import { CloudAppStoreService, FormGroupUtil } from '@exlibris/exl-cloudapp-angular-lib';

const KEY = 'StoreForm';

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

    this.storeService.get(KEY).subscribe( value => {
      if (value) {
        this.form = FormGroupUtil.toFormGroup(value);
      }

      this.form.valueChanges.pipe(
        debounceTime(500), 
        switchMap(val=>this.storeService.set(KEY, val))
      ).subscribe()
    })
  }
}
