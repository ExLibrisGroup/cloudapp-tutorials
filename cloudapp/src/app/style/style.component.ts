import { Component, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { AlertService } from '@exlibris/exl-cloudapp-angular-lib';
import { EMPTY } from 'rxjs';
import { delay, finalize } from 'rxjs/operators';
import { AppService } from '../app.service';

const INIT_VALUES = ['Lorem ipsum dolor sit amet', 'Pellentesque sit amet tempor tellus', 'Vivamus quis velit eget turpis', 'Curabitur ut justo metus'];

@Component({
  selector: 'app-style',
  templateUrl: './style.component.html',
  styleUrls: ['./style.component.scss']
})
export class StyleComponent implements OnInit {
  items = [];
  loading = false;

  constructor( 
    public dialog: MatDialog, 
    public alert: AlertService,
    public appService: AppService,
  ) { }

  ngOnInit() {
    this.appService.setTitle('Following the Style Guide');
    this._reset().subscribe();
  }

  remove(index: number) {
    this.items.splice(index, 1);
  }

  private _reset() {
    this.loading = true;
    return EMPTY.pipe(
      delay(1000),
      finalize(()=> {
        this.items = [...INIT_VALUES];
        this.loading = false;
      }) 
    );
  }

  reset() {
    const dialogRef = this.dialog.open(ConfirmationDialog, { autoFocus: false });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this._reset().subscribe({
        complete: () => this.alert.success('List successfully reset.')
      });
    });
  }
}

@Component({
  selector: 'style-confirmation-dialog',
  templateUrl: 'confirmation-dialog.html',
})
export class ConfirmationDialog {
  constructor() {}
}