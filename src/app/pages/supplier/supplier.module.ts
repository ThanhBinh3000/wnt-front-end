import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SupplierComponent} from './supplier.component';
import {RouterOutlet} from "@angular/router";
import {SupplierRoutingModule} from "./supplier.routing";
import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SupplierAddEditDialogComponent } from './supplier-add-edit-dialog/supplier-add-edit-dialog.component';
import { SupplierRewardProgramDialogComponent } from './supplier-reward-program-dialog/supplier-reward-program-dialog.component';

@NgModule({
  declarations: [
    SupplierComponent,
    SupplierListComponent,
    SupplierAddEditDialogComponent,
    SupplierRewardProgramDialogComponent
  ],
  imports: [CommonModule, RouterOutlet, SupplierRoutingModule],
  exports: [
    SupplierAddEditDialogComponent,
    SupplierRewardProgramDialogComponent
  ],
})
export class SupplierModule {
}
