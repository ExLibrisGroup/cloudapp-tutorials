import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { CloudAppEventsService, Entity } from '@exlibris/exl-cloudapp-angular-lib';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {

  constructor(
    private appService: AppService,
  ) { }

  ngOnInit() {
    this.appService.setTitle('Multi-select');
  }

  selectedEntities = new Array<Entity>();
}
