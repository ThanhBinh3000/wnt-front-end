import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { SupplierGroupComponent } from './supplier-group.component';
import { SupplierGroupListComponent } from './supplier-group-list/supplier-group-list.component';
const routes: Routes = [
  {
    path: '',
    component: SupplierGroupComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: SupplierGroupListComponent,
        // canActivate: [AuthGuard],
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupplierGroupRoutingModule {
}
