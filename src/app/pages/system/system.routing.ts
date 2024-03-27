import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SystemComponent} from "./system.component";
import {AuthGuard} from "../../guard/auth.guard";
import { AccountManagerComponent } from './admin/account-manager/account-manager.component';
import { DrugStoreListingComponent } from './drug-store/drug-store-listing/drug-store-listing.component';
import { DrugStoreInformationComponent } from './drug-store/drug-store-information/drug-store-information.component';

const routes: Routes = [
  {
    path: '',
    component: SystemComponent,
    children: [
      {
        path: 'account-manager',
        component: AccountManagerComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'drug-store-listing',
        component: DrugStoreListingComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'drug-store-information',
        component: DrugStoreInformationComponent,
        // canActivate: [AuthGuard],
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SystemRoutingModule {
}
