import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./layout.component";
import {HomeComponent} from "../pages/home/home.component";
import {NotificationComponent} from "../pages/notification/notification.component";
import {AuthGuard} from "../guard/auth.guard";

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomeComponent
      },
      {
        path: 'account',
        loadChildren: () => import('../pages/account/account.module').then((m) => m.AccountModule),
      },
      {
        path: 'customer-group',
        loadChildren: () => import('../pages/customer-group/customer-group.module').then((m) => m.CustomerGroupModule),
      },
      {
        path: 'customer',
        loadChildren: () => import('../pages/customer/customer.module').then((m) => m.CustomerModule),
      },
      {
        path: 'supplier-group',
        loadChildren: () => import('../pages/supplier-group/supplier-group.module').then((m) => m.SupplierGroupModule),
      },
      {
        path: 'supplier',
        loadChildren: () => import('../pages/supplier/supplier.module').then((m) => m.SupplierModule),
      },
      {
        path: 'doctor-group',
        loadChildren: () => import('../pages/doctor-group/doctor-group.module').then((m) => m.DoctorGroupModule),
      },
      {
        path: 'doctor',
        loadChildren: () => import('../pages/doctor/doctor.module').then((m) => m.DoctorModule),
      },
      {
        path: 'notification',
        component: NotificationComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRouting {
}
