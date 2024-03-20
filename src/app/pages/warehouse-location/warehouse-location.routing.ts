import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { WarehouseLocationComponent } from './warehouse-location.component';
import { WarehouseLocationListComponent } from './warehouse-location-list/warehouse-location-list.component';
const routes: Routes = [
  {
    path: '',
    component: WarehouseLocationComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: WarehouseLocationListComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarehouseLocationRoutingModule {
}
