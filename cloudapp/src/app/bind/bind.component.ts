import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../app.service';
import { FormGroup } from '@angular/forms';
import { CloudAppRestService, CloudAppEventsService, PageInfo, HttpMethod } from '@exlibris/exl-cloudapp-angular-lib';
import { Subscription } from 'rxjs';
import { finalize, switchMap, tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { toFormGroup } from '../utils'

@Component({
  selector: 'app-bind',
  templateUrl: './bind.component.html',
  styleUrls: ['./bind.component.scss']
})
export class BindComponent implements OnInit, OnDestroy {
  private pageLoad$: Subscription;
  form: FormGroup;
  saving = false;

  constructor(    
    private appService: AppService,
    private restService: CloudAppRestService,
    private eventsService: CloudAppEventsService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.appService.setTitle('Model Binding');
    this.pageLoad$ = this.eventsService.onPageLoad((pageInfo: PageInfo) => {
      const entities = (pageInfo.entities||[]).filter(e=>e.type=='ITEM');
      if (entities.length > 0) {
        this.restService.call(entities[0].link)
          .subscribe(res=>this.form = toFormGroup(res) as FormGroup);
      }
    });
  }

  ngOnDestroy() {
    this.pageLoad$.unsubscribe();
  }

  save() {
    this.saving = true;
    this.restService.call({
      url: this.form.get('link').value,
      requestBody: this.form.value,
      method: HttpMethod.PUT
    }).pipe(
      switchMap(res => this.eventsService.refreshPage()),
      tap(() => this.toastr.success('Item updated')),
      finalize(() => this.saving=false)
    )
    .subscribe({
      error: e => this.toastr.error(e.message)
    });
  }
}
