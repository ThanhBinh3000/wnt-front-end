import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { DrugUnitComponent } from './drug-unit.component';
import { DrugUnitListComponent } from './drug-unit-location-list/drug-unit-list.component';
const routes: Routes = [
  {
    path: '',
    component: DrugUnitComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: DrugUnitListComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrugUnitRoutingModule {
}
