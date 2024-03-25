import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { ConnectivityComponent } from './connectivity.component';
import { ConnectivityListComponent } from './connectivity-list/connectivity-list.component';
import { ConnectivitySampleNoteListComponent } from './connectivity-sample-note-list/connectivity-sample-note-list.component';

const routes: Routes = [
  {
    path: '',
    component: ConnectivityComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: ConnectivityListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'sample-note-list',
        component: ConnectivitySampleNoteListComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConnectivityRoutingModule {
}
