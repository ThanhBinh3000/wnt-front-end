import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'drug-add-edit-dialog',
  templateUrl: './drug-add-edit-dialog.component.html',
  styleUrls: ['./drug-add-edit-dialog.component.css'],
})
export class DrugAddEditDialogComponent implements OnInit {
  @Input() drugID: number = 0;
  @Input() location: string = 'body';
  checkTab: string = 'main-information';

  constructor() {
  }

  ngOnInit() {
  }

}