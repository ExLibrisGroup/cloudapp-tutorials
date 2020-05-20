import { Component, OnInit } from '@angular/core';
import { CloudAppRestService, RestErrorResponse } from '@exlibris/exl-cloudapp-angular-lib';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { of, forkJoin, Observable } from 'rxjs';
import { AppService } from '../app.service';

@Component({
  selector: 'app-parallel',
  templateUrl: './parallel.component.html',
  styleUrls: ['./parallel.component.scss']
})
export class ParallelComponent implements OnInit {
  users: any[];
  num = 10;
  loading = false;
  processed = 0;
  showProgress = false;

  constructor( 
    private restService: CloudAppRestService,
    private appService: AppService
  ) { }

  ngOnInit() {
    this.appService.setTitle('Parallel Requests');
  }

  run() {
    this.users = [];
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.processed = 0;
    this.restService.call(`/users?limit=${this.num}`)
    .pipe(
      map(users=>this.addErrors(users.user).map(user=>this.getUser(user))),
      switchMap(reqs=>forkJoin(reqs)),
    )
    .subscribe({
      next: (s: any[])=>{
        s.forEach(user=>{
          if (isRestErrorResponse(user)) {
            console.log('Error retrieving user: ' + user.message)
          } else {
            this.users.push(user);
          }
        })
      },
      complete: () => this.loading=false
    });
  }

  clear() {
    this.users = [];
  }

  getUser(user: any) {
    return this.restService.call(`/users/${user.primary_id}?expand=fees`).pipe(
      tap(()=>this.processed++),
      catchError(e => of(e)),
    )
  }

  addErrors(users: any[]) {
    for (let i=0; i<Math.floor(users.length*.25); i++) {
      users.splice(getRandomInt(users.length-1), 0, { primary_id: getRandomInt(1000000) });
    };
    return users;
  }

  get percentComplete() {
    return Math.round((this.processed/this.num)*100)
  }
}

const getRandomInt = (max: number)  => Math.floor(Math.random() * Math.floor(max));
const isRestErrorResponse = (object: any): object is RestErrorResponse => 'error' in object;