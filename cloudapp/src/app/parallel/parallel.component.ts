import { Component, OnInit } from '@angular/core';
import { CloudAppRestService, RestErrorResponse } from '@exlibris/exl-cloudapp-angular-lib';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { from, of } from 'rxjs';
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
      mergeMap(user => this.restService.call(`/users/${user.primary_id}?expand=fees`), 
        CONCURRENT_REQUESTS),
      map(user=>({name: user.full_name, fees: user.fees}))
    )
    .subscribe(s=>this.users.push(s));
  }

  loadUsersWithErrors(users: any[]) {
    from(this.addErrors(users)).pipe(
      mergeMap(user => this.getUser(user), 
        CONCURRENT_REQUESTS)
    )
    .subscribe(s=> {
      if (isRestErrorResponse(s)) {
        console.log('Error retrieving user:', s.message);
      } else {
        this.users.push(s)
      }
    });
  }

  getUsers() {
    return this.restService.call('/users?limit=50');
  }

  getUser(user) {
    return this.restService.call(`/users/${user.primary_id}?expand=fees`)
      .pipe(
        map(user=>({name: user.full_name, fees: user.fees})),
        catchError(e=>of(e))
      )
  }

  addErrors(users: any[]) {
    for (let i=0; i<Math.floor(users.length*.25); i++) {
      users.splice(getRandomInt(users.length-1), 0, { primary_id: getRandomInt(1000000) });
    };
    return users;
  }
}

const getRandomInt = (max: number)  => Math.floor(Math.random() * Math.floor(max));
const isRestErrorResponse = (object: any): object is RestErrorResponse => 'error' in object;
