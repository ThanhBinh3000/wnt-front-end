import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { SupplierComponent } from './supplier.component';
import { SupplierListComponent } from './supplier-list/supplier-list.component';
const routes: Routes = [
  {
    path: '',
    component: SupplierComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
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
export class SupplierRoutingModule {
}
