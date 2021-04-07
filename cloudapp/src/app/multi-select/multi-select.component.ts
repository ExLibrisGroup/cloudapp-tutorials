import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { Entity } from '@exlibris/exl-cloudapp-angular-lib';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {
  count = 0;
  
  constructor(
    private appService: AppService,
  ) { }

  ngOnInit() {
    this.appService.setTitle('Multi-select');
  }

  selectedEntities = new Array<Entity>();
}
