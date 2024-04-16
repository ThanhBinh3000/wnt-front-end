import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../guard/auth.guard";
import { ReportComponent } from './report.component';
import { DrugTransactionHistoryComponent } from './drug-transaction-history/drug-transaction-history.component';
import {RevenueDetailsByDayComponent} from "./RevenueDetailsByDay/RevenueDetailsByDay.component";

const routes: Routes = [
  {
    path: '',
    component: ReportComponent,
    children: [
      {
        path: 'drug-transaction-history',
        component: DrugTransactionHistoryComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'RevenueDetailsByDay',
        component: RevenueDetailsByDayComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule {
}
