import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CustomerGroupComponent} from './customer-group.component';
import {RouterOutlet} from "@angular/router";
import {CustomerGroupRoutingModule} from "./customer-group.routing";
import { CustomerGroupListComponent } from './customer-group-list/customer-group-list.component';
import { CustomerGroupAddEditDialogComponent } from './customer-group-add-edit-dialog/customer-group-add-edit-dialog.component';
import {ComponentsModule} from "../../component/base/components.module";

@NgModule({
  declarations: [
    CustomerGroupComponent,
    CustomerGroupListComponent,
    CustomerGroupAddEditDialogComponent,
  ],
    imports: [CommonModule, RouterOutlet, CustomerGroupRoutingModule, ComponentsModule],
  exports: [
    CustomerGroupAddEditDialogComponent
  ],
})
export class CustomerGroupModule {
}
