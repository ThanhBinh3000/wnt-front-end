import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {InventoryComponent} from './inventory.component';
import {RouterOutlet} from "@angular/router";
import { InventoryRoutingModule} from './inventory.routing';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { DrugNotInventoryComponent } from './drug-not-inventory/drug-not-inventory.component';
import { InventoryAddEditComponent } from './inventory-add-edit/inventory-add-edit.component';
import { InventoryItemUpdateDialogComponent } from './inventory-item-update-dialog/inventory-item-update-dialog.component';
import { InventoryDetailComponent } from './inventory-detail/inventory-detail.component';
import { InventoryMultipleWarehouseDialogComponent } from './inventory-multiple-warehouse-dialog/inventory-multiple-warehouse-dialog.component';
@NgModule({
  declarations: [
    InventoryComponent,
    InventoryListComponent,
    DrugNotInventoryComponent,
    InventoryAddEditComponent,
    InventoryItemUpdateDialogComponent,
    InventoryDetailComponent,
    InventoryMultipleWarehouseDialogComponent
  ],
  imports: [CommonModule, RouterOutlet, InventoryRoutingModule],
  exports: [
    InventoryMultipleWarehouseDialogComponent
  ],
})
export class InventoryModule {
}
