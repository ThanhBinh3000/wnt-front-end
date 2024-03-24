import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from "./layout.component";
import {HomeComponent} from "../pages/home/home.component";
import {NotificationComponent} from "../pages/notification/notification.component";

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
        path: 'service-group',
        loadChildren: () => import('../pages/service-group/service-group.module').then((m) => m.ServiceGroupModule),
      },
      {
        path: 'service',
        loadChildren: () => import('../pages/service/service.module').then((m) => m.ServiceModule),
      },
      {
        path: 'warehouse-location',
        loadChildren: () => import('../pages/warehouse-location/warehouse-location.module').then((m) => m.WarehouseLocationModule),
      },
      {
        path: 'drug-unit',
        loadChildren: () => import('../pages/drug-unit/drug-unit.module').then((m) => m.DrugUnitModule),
      },
      {
        path: 'drug-group',
        loadChildren: () => import('../pages/drug-group/drug-group.module').then((m) => m.DrugGroupModule),
      },
      {
        path: 'drug',
        loadChildren: () => import('../pages/drug/drug.module').then((m) => m.DrugModule),
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
        path: 'system',
        loadChildren: () => import('../pages/system/system.module').then((m) => m.SystemModule),
      },
      {
        path: 'order',
        loadChildren: () => import('../pages/order/order.module').then((m) => m.OrderModule),
      },
      {
        path: 'inventory',
        loadChildren: () => import('../pages/inventory/inventory.module').then((m) => m.InventoryModule),
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
