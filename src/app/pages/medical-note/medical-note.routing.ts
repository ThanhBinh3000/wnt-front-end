import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { MedicalNoteComponent } from './medical-note.component';
import { MedicalNoteHistoryListComponent } from './medical-note-history-list/medical-note-history-list.component';
import { MedicalNoteAddEditComponent } from './medical-note-add-edit/medical-note-add-edit.component';
import {MedicalNoteListComponent} from "./medical-note-list/medical-note-list.component";
const routes: Routes = [
  {
    path: '',
    component: MedicalNoteComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: MedicalNoteListComponent,
        // canActivate: [AuthGuard],
        data: { isWaitList: false }
      },
      {
        path: 'wait-list',
        component: MedicalNoteListComponent,
        // canActivate: [AuthGuard],
        data: { isWaitList: true }
      },
      {
        path: 'history-list',
        component: MedicalNoteHistoryListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'add',
        component: MedicalNoteAddEditComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'edit/:id',
        component: MedicalNoteAddEditComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MedicalNoteRoutingModule {
}
