import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'customer-add-edit-dialog',
  templateUrl: './customer-add-edit-dialog.component.html',
  styleUrls: ['./customer-add-edit-dialog.component.css'],
})
export class CustomerAddEditDialogComponent implements OnInit {
  @Input() customerID = 0;
  
  constructor() {
  }

  ngOnInit() {
  }
}