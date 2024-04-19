import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportComponent} from './report.component';
import {DrugTransactionHistoryComponent} from './drug-transaction-history/drug-transaction-history.component';
import {RevenueDetailsByDayComponent} from "./RevenueDetailsByDay/RevenueDetailsByDay.component";
import {InOutCommingDetailsByDayComponent} from "./InOutCommingDetailsByDay/InOutCommingDetailsByDay.component";

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
      {
        path: 'InOutCommingDetailsByDay',
        component: InOutCommingDetailsByDayComponent,
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
