import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../guard/auth.guard";
import { PartnerComponent } from './partner.component';
import { CustomerGroupListComponent } from './customer-group/customer-group-list/customer-group-list.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
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
