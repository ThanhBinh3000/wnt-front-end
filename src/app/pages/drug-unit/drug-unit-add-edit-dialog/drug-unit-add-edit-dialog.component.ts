import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'drug-unit-add-edit-dialog',
  templateUrl: './drug-unit-add-edit-dialog.component.html',
  styleUrls: ['./drug-unit-add-edit-dialog.component.css'],
})
export class DrugUnitAddEditDialogComponent implements OnInit {
  @Input() drugUnitID: number = 0;

  constructor() {
  }

  ngOnInit() {
  }
}