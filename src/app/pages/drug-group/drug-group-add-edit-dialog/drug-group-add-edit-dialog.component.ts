import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'drug-group-add-edit-dialog',
  templateUrl: './drug-group-add-edit-dialog.component.html',
  styleUrls: ['./drug-group-add-edit-dialog.component.css'],
})
export class DrugGroupAddEditDialogComponent implements OnInit {
  @Input() drugGroupID: number = 0;

  constructor() {
  }

  ngOnInit() {
  }
}