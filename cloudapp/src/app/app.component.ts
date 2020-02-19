import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  template: '<app-topmenu></app-topmenu><router-outlet></router-outlet>'
})
export class AppComponent {

  constructor(private appService: AppService) { }

}
