import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'supplier-add-edit-dialog',
  templateUrl: './supplier-add-edit-dialog.component.html',
  styleUrls: ['./supplier-add-edit-dialog.component.css'],
})
export class SupplierAddEditDialogComponent implements OnInit {
  @Input() supplierID: number = 0;
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