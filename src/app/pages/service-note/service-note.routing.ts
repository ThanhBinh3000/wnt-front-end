import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { ServiceNoteComponent } from './service-note.component';
import { ServiceNoteListComponent } from './service-note-list/service-note-list.component';
import { ServiceNoteAddEditComponent } from './service-note-add-edit/service-note-add-edit.component';
const routes: Routes = [
  {
    path: '',
    component: ServiceNoteComponent,
    children: [
      {
        path: '',
        redirectTo: 'service-note-list',
        pathMatch: 'full',
      },
      {
        path: 'service-note-list',
        component: ServiceNoteListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'service-note-add-edit',
        component: ServiceNoteAddEditComponent,
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
