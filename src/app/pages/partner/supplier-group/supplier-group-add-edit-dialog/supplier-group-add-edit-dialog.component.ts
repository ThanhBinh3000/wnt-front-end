import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'supplier-group-add-edit-dialog',
  templateUrl: './supplier-group-add-edit-dialog.component.html',
  styleUrls: ['./supplier-group-add-edit-dialog.component.css'],
})
export class SupplierGroupAddEditDialogComponent implements OnInit {
  @Input() supplierGroupID = 0;
  
  constructor() {
  }

  ngOnInit() {
  }
}