import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PartnerComponent} from './partner.component';
import {RouterOutlet} from "@angular/router";
import {PartnerRoutingModule} from "./partner.routing";
import { CustomerGroupListComponent } from './customer-group/customer-group-list/customer-group-list.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerGroupAddEditDialogComponent } from './customer-group/customer-group-add-edit-dialog/customer-group-add-edit-dialog.component';

@NgModule({
  declarations: [
    PartnerComponent,
    CustomerGroupListComponent,
    CustomerGroupAddEditDialogComponent,
    CustomerListComponent
  ],
  imports: [CommonModule, RouterOutlet, PartnerRoutingModule],
  exports: [],
})
export class PartnerModule {
}
