import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SupplierGroupComponent} from './supplier-group.component';
import {RouterOutlet} from "@angular/router";
import {SupplierGroupRoutingModule} from "./supplier-group.routing";
import { SupplierGroupAddEditDialogComponent } from './supplier-group-add-edit-dialog/supplier-group-add-edit-dialog.component';
import { SupplierGroupListComponent } from './supplier-group-list/supplier-group-list.component';
import { ComponentsModule } from '../../component/base/components.module';
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
@NgModule({
  declarations: [
    SupplierGroupComponent,
    SupplierGroupListComponent,
    SupplierGroupAddEditDialogComponent,
  ],
  imports: [CommonModule, RouterOutlet, SupplierGroupRoutingModule , ComponentsModule],
  exports: [
    SupplierGroupAddEditDialogComponent
  ],
})
export class SupplierGroupModule {
}
