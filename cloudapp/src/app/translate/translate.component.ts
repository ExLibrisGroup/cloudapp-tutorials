import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { CloudAppEventsService, InitData, CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';

@Component({
  selector: 'app-translate',
  templateUrl: './translate.component.html',
  styleUrls: ['./translate.component.scss']
})
export class TranslateComponent implements OnInit {
  initData: InitData;
  policies: { code: string, desc: string }[];
  today = new Date().toLocaleDateString();
  blockTypes: any;
  dir = "ltr";

  constructor(
    private appService: AppService,
    private translate: TranslateService,
    private eventsService: CloudAppEventsService,
  ) { }

  ngOnInit() {
    this.translate.get('Translate.Title').subscribe(text=>this.appService.setTitle(text));
    this.eventsService.getInitData().subscribe(data=>this.initData = data);
    this.policies = [
      { code: 'D', desc: _('Translate.Policies.DAILY') },
      { code: 'W', desc: _('Translate.Policies.WEEKLY') },
      { code: 'M', desc: _('Translate.Policies.MONTHLY') },
      { code: 'Y', desc: _('Translate.Policies.YEARLY') },
    ];
    this.translate.onLangChange.subscribe((event: LangChangeEvent) =>
    {
      this.dir = ['ar', 'he'].includes(event.lang) ? 'rtl' : 'ltr';
    });

  }

  hi() {
    alert(this.translate.instant('Translate.Prompt',
      { name: this.initData.user.firstName } )
    );
  }

  setLang(lang: string) {
    this.translate.use(lang);
  }

}
