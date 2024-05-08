import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { ServiceNoteComponent } from './service-note.component';
import { ServiceNoteListComponent } from './service-note-list/service-note-list.component';
import { ServiceNoteAddEditComponent } from './service-note-add-edit/service-note-add-edit.component';
import {ServiceNoteDetailComponent} from "./service-note-detail/service-note-detail.component";
import {ServiceNoteWaitListComponent} from "./service-note-wait-list/service-note-wait-list.component";
const routes: Routes = [
  {
    path: '',
    component: ServiceNoteComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: ServiceNoteListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'wait-list',
        component: ServiceNoteWaitListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'add',
        component: ServiceNoteAddEditComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'edit/:id',
        component: ServiceNoteAddEditComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'detail/:id',
        component: ServiceNoteDetailComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ServiceNoteRoutingModule {
}
