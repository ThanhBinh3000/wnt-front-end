import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SupplierGroupComponent} from './supplier-group.component';
import {RouterOutlet} from "@angular/router";
import {SupplierGroupRoutingModule} from "./supplier-group.routing";
import { SupplierGroupAddEditDialogComponent } from './supplier-group-add-edit-dialog/supplier-group-add-edit-dialog.component';
import { SupplierGroupListComponent } from './supplier-group-list/supplier-group-list.component';

@NgModule({
  declarations: [
    SupplierGroupComponent,
    SupplierGroupListComponent,
    SupplierGroupAddEditDialogComponent,
  ],
  imports: [CommonModule, RouterOutlet, SupplierGroupRoutingModule],
  exports: [],
})
export class SupplierGroupModule {
}
