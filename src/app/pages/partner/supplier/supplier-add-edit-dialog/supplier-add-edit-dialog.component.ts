import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'supplier-add-edit-dialog',
  templateUrl: './supplier-add-edit-dialog.component.html',
  styleUrls: ['./supplier-add-edit-dialog.component.css'],
})
export class SupplierAddEditDialogComponent implements OnInit {
  @Input() supplierID = 0;
  
  constructor() {
  }

  ngOnInit() {
  }
}