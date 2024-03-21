import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { DoctorGroupComponent } from './doctor-group.component';
import { DoctorGroupListComponent } from './doctor-group-list/doctor-group-list.component';
const routes: Routes = [
  {
    path: '',
    component: DoctorGroupComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: DoctorGroupListComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DoctorGroupRoutingModule {
}
