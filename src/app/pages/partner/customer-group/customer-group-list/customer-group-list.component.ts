import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-partner',
  templateUrl: './customer-group-list.component.html',
  styleUrls: ['./customer-group-list.component.css'],
})
export class CustomerGroupListComponent implements OnInit {
  isOpenCustomerGroupCreateEditDialog: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  showCustomerGroupCreateEditDialog() {
    this.isOpenCustomerGroupCreateEditDialog = true;
  }
}