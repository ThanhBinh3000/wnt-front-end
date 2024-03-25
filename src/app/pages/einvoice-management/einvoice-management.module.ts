import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EInvoiceManagementComponent} from './einvoice-management.component';
import {RouterOutlet} from "@angular/router";
import {EInvoiceRoutingModule} from "./einvoice-management.routing";
import { EInvoiceCMCComponent } from './einvoice-cmc/einvoice-cmc.component';
import { EInvoiceVNPTComponent } from './einvoice-vnpt/einvoice-vnpt.component';

@NgModule({
  declarations: [
    EInvoiceManagementComponent,
    EInvoiceCMCComponent,
    EInvoiceVNPTComponent
  ],
  imports: [CommonModule, RouterOutlet, EInvoiceRoutingModule],
  exports: [
  ],
})
export class EInvoiceModule {
}
