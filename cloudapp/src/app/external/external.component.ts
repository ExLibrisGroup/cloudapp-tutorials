import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AppService } from '../app.service';
import { HttpClient } from '@angular/common/http';
import { map, finalize } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { LightboxComponent } from './lightbox/lightbox.component';
import { CloudAppEventsService, AlertService } from '@exlibris/exl-cloudapp-angular-lib';

const WINDOW_PROPS = "width=750,height=500,resizable,";

@Component({
  selector: 'app-external',
  templateUrl: './external.component.html',
  styleUrls: ['./external.component.scss']
})
export class ExternalComponent implements OnInit {
  @ViewChild(LightboxComponent, {static: true}) lightbox: LightboxComponent;
  running = false;
  record: any;
  images: Array<string> = [];
  authToken: string;
  popupResponse: any;

  constructor(
    private appService: AppService,
    private eventsService: CloudAppEventsService,
    private http: HttpClient,
    private alert: AlertService
  ) { }

  ngOnInit() {
    this.appService.setTitle('Reaching out');
    this.eventsService.getAuthToken()
      .subscribe(authToken => this.authToken = authToken);
  }

  search(identifierType: string, identifier: string) {
    this.running = true;
    this.record = null;
    this.http.get<any>(hathitrustSearchUrl(identifierType, identifier))
      .pipe(
        map(res => {
          if (Object.keys(res.records).length == 0) {
            throw new Error('Record not found');
          } else {
            return Object.assign({items: res.items}, 
              { id: Object.keys(res.records)[0] }, Object.values(res.records)[0] )
          }
        }), 
        finalize(() => this.running = false)
      )
      .subscribe({
        next: resp => this.record = resp,
        error: e => this.alert.error(e.message)
      });
  }

  dataApi(id: string) {
    const headers = {'Authorization': `Bearer ${this.authToken}` };
    this.lightbox.headers = headers;
    this.running = true;
    this.http.get<any>(hathitrustMetaUrl(id), { headers } ).pipe(
      map( resp => {
        if (resp['htd:seqmap'] && resp['htd:seqmap'][0] && resp['htd:seqmap'][0]['htd:seq']) {
          const seqmap: Array<any> = resp['htd:seqmap'][0]['htd:seq'];
          return seqmap.map( s => hathitrustImageUrl(id, s.pseq) );
        }
      }),
      finalize(() => this.running = false)
    ).subscribe({
      next: resp => this.images = resp,
      error: e => this.alert.error(e.message)
    })
  }

  openModal() {
    this.lightbox.openModal();
    this.lightbox.images = this.images;
    this.lightbox.currentSlide(1);
  }

  openPopup() {
    this.popupResponse = null;
    window.open(environment.popupUrl, "_blank", WINDOW_PROPS);
  }

  @HostListener('window:message', ['$event'])
  onMessage(event: MessageEvent) {
    if (event.data && event.data.tutorialReponse) {
      this.popupResponse = event.data.tutorialReponse;
    }
  }
}

const hathitrustMetaUrl = (id: string) => `${environment.hathitrustProxy}/volume/meta/${id}?v=2&format=json`;
const hathitrustImageUrl = (id: string, pseq: string) => `${environment.hathitrustProxy}/volume/pageimage/${id}/${pseq}?v=2&format=png&res=2`;
const hathitrustSearchUrl = (identifierType: string, identifier: string) => `${environment.hathitrustUrl}/api/volumes/brief/${identifierType}/${identifier}.json`;