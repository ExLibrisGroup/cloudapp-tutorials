import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { HttpClient } from '@angular/common/http';
import { map, finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-external',
  templateUrl: './external.component.html',
  styleUrls: ['./external.component.scss']
})
export class ExternalComponent implements OnInit {
  running = false;
  record: any;

  constructor(
    private appService: AppService,
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.appService.setTitle('Reaching out');
  }

  search(identifierType: string, identifier: string) {
    this.running = true;
    this.record = null;
    this.http.get<any>(`https://catalog.hathitrust.org/api/volumes/brief/${identifierType}/${identifier}.json`)
      .pipe(
        map(res => {
          if (Object.keys(res.records).length == 0) {
            throw new Error('Record not found');
          } else {
            return Object.assign({items: res.items}, 
              { id: Object.keys(res.records)[0], ...Object.values(res.records)[0] })
          }
        }), 
        finalize(() => this.running = false)
      )
      .subscribe( {
        next: response=>this.record = response,
        error: (e) => this.toastr.error(e.message)
      });
  }
}
