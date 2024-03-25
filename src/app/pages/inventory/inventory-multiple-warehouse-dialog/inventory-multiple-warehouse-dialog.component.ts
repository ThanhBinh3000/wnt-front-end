import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'inventory-multiple-warehouse-dialog',
  templateUrl: './inventory-multiple-warehouse-dialog.component.html',
  styleUrl: './inventory-multiple-warehouse-dialog.component.css'
})
export class InventoryMultipleWarehouseDialogComponent implements OnInit {
  @Input() drugId: number = 0;
  
  constructor() {
  }

  ngOnInit() {
  }
}
