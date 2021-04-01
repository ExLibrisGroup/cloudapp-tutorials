import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { CloudAppEventsService, Entity } from '@exlibris/exl-cloudapp-angular-lib';

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss']
})
export class MultiSelectComponent implements OnInit {
  public entities$ = this.eventsService.entities$;

  constructor(
    private appService: AppService,
    private eventsService: CloudAppEventsService
  ) { }

  ngOnInit() {
    this.appService.setTitle('Multi-select');
  }

  ngOnDestroy(): void {
  }

  selectedEntities = new Set<string>();
  isEntitySelected = (entity: Entity) => this.selectedEntities.has(entity.id);

  onEntitySelected(event: {entity: Entity, checked: boolean}) {
    if (event.checked) this.selectedEntities.add(event.entity.id);
    else this.selectedEntities.delete(event.entity.id);
  }


}
