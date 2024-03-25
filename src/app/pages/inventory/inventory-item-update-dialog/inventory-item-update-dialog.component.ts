import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'inventory-item-update-dialog',
  templateUrl: './inventory-item-update-dialog.component.html',
  styleUrl: './inventory-item-update-dialog.component.css'
})
export class InventoryItemUpdateDialogComponent implements OnInit {
  @Input() drugId: number = 0;
  
  constructor() {
  }

  ngOnInit() {
  }
}
