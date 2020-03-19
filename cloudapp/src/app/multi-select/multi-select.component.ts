import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Entity, CloudAppEventsService } from '@exlibris/exl-cloudapp-angular-lib';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {
  private pageLoad$: Subscription;
  ids = new Set<string>();
  entities: Entity[];

  constructor(
    private appService: AppService,
    private eventsService: CloudAppEventsService
  ) { }

  ngOnInit() {
    this.appService.setTitle('Multi-select');
    this.pageLoad$ = this.eventsService.onPageLoad( pageInfo => {
      this.entities = (pageInfo.entities||[]);
    });
  }

  ngOnDestroy(): void {
    this.pageLoad$.unsubscribe();
  }

  onEntitySelected(event) {
    if (event.checked) this.ids.add(event.mmsId);
    else this.ids.delete(event.mmsId);
  }


}
