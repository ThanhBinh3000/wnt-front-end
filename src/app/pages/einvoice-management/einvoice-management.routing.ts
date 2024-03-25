import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { EInvoiceManagementComponent } from './einvoice-management.component';
import { EInvoiceCMCComponent } from './einvoice-cmc/einvoice-cmc.component';
import { EInvoiceVNPTComponent } from './einvoice-vnpt/einvoice-vnpt.component';
const routes: Routes = [
  {
    path: '',
    component: EInvoiceManagementComponent,
    children: [
      {
        path: '',
        redirectTo: 'cmc',
        pathMatch: 'full',
      },
      {
        path: 'cmc',
        component: EInvoiceCMCComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'vnpt',
        component: EInvoiceVNPTComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EInvoiceRoutingModule {
}
