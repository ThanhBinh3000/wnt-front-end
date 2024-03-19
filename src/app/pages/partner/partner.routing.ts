import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { PartnerComponent } from './partner.component';
import { CustomerGroupListComponent } from './customer-group/customer-group-list/customer-group-list.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { DoctorGroupListComponent } from './doctor-group/doctor-group-list/doctor-group-list.component';
import { DoctorListComponent } from './doctor/doctor-list/doctor-list.component';
import { SupplierGroupListComponent } from './supplier-group/supplier-group-list/supplier-group-list.component';
import { SupplierListComponent } from './supplier/supplier-list/supplier-list.component';
const routes: Routes = [
  {
    path: '',
    component: PartnerComponent,
    children: [
      {
        path: '',
        redirectTo: 'customer-group-list',
        pathMatch: 'full',
      },
      {
        path: 'customer-group-list',
        component: CustomerGroupListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'customer-list',
        component: CustomerListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'doctor-group-list',
        component: DoctorGroupListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'doctor-list',
        component: DoctorListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'supplier-group-list',
        component: SupplierGroupListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'supplier-list',
        component: SupplierListComponent,
        // canActivate: [AuthGuard],
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PartnerRoutingModule {
}
