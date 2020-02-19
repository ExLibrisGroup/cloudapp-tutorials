import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-newroute',
  templateUrl: './newroute.component.html',
  styleUrls: ['./newroute.component.scss']
})
export class NewrouteComponent implements OnInit {

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.setTitle('New Route');
  }

}
