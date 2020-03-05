import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../app.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CloudAppEventsService, PageInfo, EntityType, CloudAppRestService } from '@exlibris/exl-cloudapp-angular-lib';
import { ToastrService } from 'ngx-toastr';
import { Bib, BibUtils } from './bib-utils';

@Component({
  selector: 'app-xml',
  templateUrl: './xml.component.html',
  styleUrls: ['./xml.component.scss']
})
export class XmlComponent implements OnInit, OnDestroy {

  private pageLoad$: Subscription;
  private bibUtils: BibUtils;
  bib: Bib;
  running = false;

  constructor(
    private appService: AppService,
    private eventsService: CloudAppEventsService,
    private restService: CloudAppRestService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.appService.setTitle('Working with XML');
    this.bibUtils = new BibUtils(this.restService);
    this.pageLoad$ = this.eventsService.onPageLoad((pageInfo: PageInfo) => {
      const entities = (pageInfo.entities||[]).filter(e=>[EntityType.BIB_MMS, 'IEP', 'BIB'].includes(e.type));
      if (entities.length > 0) {
        this.bibUtils.getBib(entities[0].id).subscribe(bib=>
          this.bib = (bib.record_format=='marc21') ? bib : null
        )
      } else {
        this.bib = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.pageLoad$.unsubscribe();
  }

  addNote() {
    if (!confirm(`Add a note to ${this.bib.mms_id}?`)) return;
    this.running = true;
    this.bib = this.bibUtils.addNoteToBib(this.bib);
    this.bibUtils.updateBib(this.bib).pipe(finalize(()=>this.running=false))
      .subscribe(
        bib=>this.eventsService.refreshPage().subscribe(
          ()=>this.toastr.success("Note added to Bib")
        ),
        (e) => this.toastr.error(e.message)
      )
  }
}