import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { ServiceGroupComponent } from './service-group.component';
import { ServiceGroupListComponent } from './service-group-list/service-group-list.component';
const routes: Routes = [
  {
    path: '',
    component: ServiceGroupComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: ServiceGroupListComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceGroupRoutingModule {
}
