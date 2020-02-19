import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';

@Component({
  selector: 'app-theming',
  templateUrl: './theming.component.html',
  styleUrls: ['./theming.component.scss']
})
export class ThemingComponent implements OnInit {

  constructor(private appService: AppService) {}

  ngOnInit() {
    this.appService.setTitle('Theming');
  }

}
