import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { DrugGroupComponent } from './drug-group.component';
import { DrugGroupListComponent } from './drug-group-list/drug-group-list.component';
const routes: Routes = [
  {
    path: '',
    component: DrugGroupComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: DrugGroupListComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrugGroupRoutingModule {
}
