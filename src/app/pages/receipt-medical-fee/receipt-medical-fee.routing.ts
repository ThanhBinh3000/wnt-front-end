import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { ReceiptMedicalFeeComponent } from './receipt-medical-fee.component';
import { ReceiptMedicalFeeListComponent } from './receipt-medical-fee-list/receipt-medical-fee-list.component';
import { ReceiptMedicalFeeAddEditComponent } from './receipt-medical-fee-add-edit/receipt-medical-fee-add-edit.component';
const routes: Routes = [
  {
    path: '',
    component: ReceiptMedicalFeeComponent,
    children: [
      {
        path: '',
        redirectTo: 'receipt-medical-fee-list',
        pathMatch: 'full',
      },
      {
        path: 'receipt-medical-fee-list',
        component: ReceiptMedicalFeeListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'receipt-medical-fee-add-edit',
        component: ReceiptMedicalFeeAddEditComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiptMedicalFeeRoutingModule {
}
