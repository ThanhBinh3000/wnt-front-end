import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'customer-add-edit-dialog',
  templateUrl: './customer-add-edit-dialog.component.html',
  styleUrls: ['./customer-add-edit-dialog.component.css'],
})
export class CustomerAddEditDialogComponent implements OnInit {
  @Input() customerID = 0;
  @Input() isMinimized: boolean = false;
  showMoreForm: boolean = false;
  expandLabel: string = '[+]';
  
  constructor() {
  }

  ngOnInit() {
  }

  expandForm() {
    this.showMoreForm = !this.showMoreForm;
    this.expandLabel = this.showMoreForm ? '[-]' : '[+]';
  };
}