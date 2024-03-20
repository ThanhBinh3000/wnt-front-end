import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { CustomerGroupComponent } from './customer-group.component';
import { CustomerGroupListComponent } from './customer-group-list/customer-group-list.component';
const routes: Routes = [
  {
    path: '',
    component: CustomerGroupComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: CustomerGroupListComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerGroupRoutingModule {
}
