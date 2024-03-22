import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { DrugComponent } from './drug.component';
import { DrugListComponent } from './drug-list/drug-list.component';
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
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrugRoutingModule {
}
