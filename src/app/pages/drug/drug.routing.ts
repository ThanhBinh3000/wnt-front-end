import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { DrugComponent } from './drug.component';
import { DrugListComponent } from './drug-list/drug-list.component';
import {DrugConnectListComponent} from "./drug-connect-list/drug-connect-list.component";
import {DrugBarCodePrintingComponent} from "./drug-bar-code-printing/drug-bar-code-printing.component";
const routes: Routes = [
  {
    path: '',
    component: DrugComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: DrugListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'connect-list',
        component: DrugConnectListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'DrugBarCode',
        component: DrugBarCodePrintingComponent,
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrugRoutingModule {
}
