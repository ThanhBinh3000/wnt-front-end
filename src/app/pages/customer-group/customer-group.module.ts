import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerGroupComponent} from './customer-group.component';
import {RouterOutlet} from "@angular/router";
import {CustomerGroupRoutingModule} from "./customer-group.routing";
import { CustomerGroupListComponent } from './customer-group-list/customer-group-list.component';
import { CustomerGroupAddEditDialogComponent } from './customer-group-add-edit-dialog/customer-group-add-edit-dialog.component';
import {ComponentsModule} from "../../component/base/components.module";
import {DrugGroupModule} from "../drug-group/drug-group.module";
import {MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@NgModule({
  declarations: [
    CustomerGroupComponent,
    CustomerGroupListComponent,
    CustomerGroupAddEditDialogComponent,
  ],
  imports: [CommonModule, RouterOutlet, CustomerGroupRoutingModule, ComponentsModule, DrugGroupModule, MatDialogContent, MatFormField, MatDialogActions, MatDialogTitle, MatInput, MatButton, MatDialogClose],
  exports: [
    CustomerGroupAddEditDialogComponent
  ],
})
export class CustomerGroupModule {
}
