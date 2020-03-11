import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { CloudAppEventsService } from '@exlibris/exl-cloudapp-angular-lib';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  isAdmin = false;

  constructor(
    private appService: AppService,
    private eventsService: CloudAppEventsService
  ) { }

  ngOnInit() { 
    this.appService.setTitle('');
    this.eventsService.getInitData().subscribe(data=>this.isAdmin = data.user.isAdmin)
  }

}
