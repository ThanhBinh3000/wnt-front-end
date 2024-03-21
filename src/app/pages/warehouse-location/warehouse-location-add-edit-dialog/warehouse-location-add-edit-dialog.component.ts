import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'warehouse-location-add-edit-dialog',
  templateUrl: './warehouse-location-add-edit-dialog.component.html',
  styleUrls: ['./warehouse-location-add-edit-dialog.component.css'],
})
export class WarehouseLocationAddEditDialogComponent implements OnInit {
  @Input() warehouseLocationID: number = 0;

  constructor() {
  }

  ngOnInit() {
  }
}