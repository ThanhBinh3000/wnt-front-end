import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../guard/auth.guard";
import {ClinicComponent } from './clinic.component';
import { ClinicListComponent } from './clinic-list/clinic-list.component';

const routes: Routes = [
  {
    path: '',
    component: ClinicComponent,
    children: [
      {
        path: 'clinic-list',
        component: ClinicListComponent,
        // canActivate: [AuthGuard],
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClinicRoutingModule {
}
