import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { MedicalNoteComponent } from './medical-note.component';
import { MedicalNoteListComponent } from './medical-note-list/medical-note-list.component';
import { MedicalNoteAddEditComponent } from './medical-note-add-edit/medical-note-add-edit.component';
const routes: Routes = [
  {
    path: '',
    component: MedicalNoteComponent,
    children: [
      {
        path: '',
        redirectTo: 'medical-note-list',
        pathMatch: 'full',
      },
      {
        path: 'medical-note-list',
        component: MedicalNoteListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'medical-note-add-edit',
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
