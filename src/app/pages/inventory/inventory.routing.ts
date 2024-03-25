import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../guard/auth.guard";
import { InventoryComponent } from './inventory.component';
import { InventoryListComponent } from './inventory-list/inventory-list.component';
import { DrugNotInventoryComponent } from './drug-not-inventory/drug-not-inventory.component';
import { InventoryAddEditComponent } from './inventory-add-edit/inventory-add-edit.component';
import { InventoryDetailComponent } from './inventory-detail/inventory-detail.component';

const routes: Routes = [
  {
    path: '',
    component: InventoryComponent,
    children: [
      {
        path: 'inventory-list',
        component: InventoryListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'drug-not-inventory',
        component: DrugNotInventoryComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'inventory-add-edit',
        component: InventoryAddEditComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'inventory-detail',
        component: InventoryDetailComponent,
        // canActivate: [AuthGuard],
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InventoryRoutingModule {
}
