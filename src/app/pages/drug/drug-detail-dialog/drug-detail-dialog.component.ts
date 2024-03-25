import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'drug-detail-dialog',
  templateUrl: './drug-detail-dialog.component.html',
  styleUrls: ['./drug-detail-dialog.component.css'],
})
export class DrugDetailDialogComponent implements OnInit {
  @Input() drugID: number = 0;

  constructor() {
  }

  ngOnInit() {
  }

}