import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DrugStoreComponent} from "./drug-store.component";
import {AuthGuard} from "../../guard/auth.guard";
import { DrugStoreListComponent } from './drug-store-list/drug-store-list.component';
import {DrugStoreTrienKhaiComponent} from "./drug-store-trien-khai/drug-store-trien-khai.component";

const routes: Routes = [
  {
    path: '',
    component: DrugStoreComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: DrugStoreListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'trien-khai',
        component: DrugStoreTrienKhaiComponent,
        // canActivate: [AuthGuard],
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrugStoreRoutingModule {
}
