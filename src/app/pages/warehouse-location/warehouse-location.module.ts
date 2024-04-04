import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseLocationComponent } from './warehouse-location.component';
import { RouterOutlet } from "@angular/router";
import { WarehouseLocationRoutingModule } from "./warehouse-location.routing";
import { WarehouseLocationAddEditDialogComponent } from './warehouse-location-add-edit-dialog/warehouse-location-add-edit-dialog.component';
import { WarehouseLocationListComponent } from './warehouse-location-list/warehouse-location-list.component';
import { ComponentsModule } from '../../component/base/components.module';

@NgModule({
  declarations: [
    WarehouseLocationComponent,
    WarehouseLocationListComponent,
    WarehouseLocationAddEditDialogComponent,
  ],
  imports: [ComponentsModule, CommonModule, RouterOutlet, WarehouseLocationRoutingModule],
  exports: [
    WarehouseLocationAddEditDialogComponent
  ],
})
export class WarehouseLocationModule {
}
