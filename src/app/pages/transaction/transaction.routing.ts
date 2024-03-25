import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { TransactionComponent } from './transaction.component';
const routes: Routes = [
  {
    path: '',
    component: TransactionComponent,
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full',
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionRoutingModule {
}
