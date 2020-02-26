import { Component, OnInit } from '@angular/core';
import { CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';
import { mergeMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import { AppService } from '../app.service';

const CONCURRENT_REQUESTS = 5;

@Component({
  selector: 'app-parallel',
  templateUrl: './parallel.component.html',
  styleUrls: ['./parallel.component.scss']
})
export class ParallelComponent implements OnInit {
  users: Array<{name: string, fees: number}>;

  constructor( 
    private restService: CloudAppRestService,
    private appService: AppService
  ) { }

  ngOnInit() {
    this.appService.setTitle('Parallel Requests');
  }

  run() {
    this.users = [];
    this.getUsers().subscribe(users=>this.loadUsers(users.user));
  }

  loadUsers(users: any[]) {
    from(users).pipe(
      mergeMap(user => this.restService.call(`/users/${user.primary_id}?expand=fees`), CONCURRENT_REQUESTS),
      map(user=>({name: user.full_name, fees: user.fees}))
    )
    .subscribe(s=>this.users.push(s));
  }

  getUsers() {
    return this.restService.call('/users?limit=50');
  }
}