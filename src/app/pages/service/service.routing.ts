import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { ServiceComponent } from './service.component';
import { ServiceListComponent } from './service-list/service-list.component';
const routes: Routes = [
  {
    path: '',
    component: ServiceComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: ServiceListComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceRoutingModule {
}
