import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'customer-group-add-edit-dialog',
  templateUrl: './customer-group-add-edit-dialog.component.html',
  styleUrls: ['./customer-group-add-edit-dialog.component.css'],
})
export class CustomerGroupAddEditDialogComponent implements OnInit {
  @Input() customerGroupID: number = 0;
  
  constructor() {
  }

  ngOnInit() {
  }
}