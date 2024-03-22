import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { InOutNoteComponent } from './in-out-note.component';
import { InOutNoteListComponent } from './in-out-note-list/in-out-note-list.component';
import { InComingNoteAddEditComponent } from './incoming-note-add-edit/incoming-note-add-edit.component';
import { OutComingNoteAddEditComponent } from './outcoming-note-add-edit/outcoming-note-add-edit.component';
import { OtherInOutNoteAddEditComponent } from './other-in-out-note-add-edit/other-in-out-note-add-edit.component';
const routes: Routes = [
  {
    path: '',
    component: InOutNoteComponent,
    children: [
      {
        path: '',
        redirectTo: 'in-out-note-list',
        pathMatch: 'full',
      },
      {
        path: 'in-out-note-list',
        component: InOutNoteListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'incoming-note-add-edit',
        component: InComingNoteAddEditComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'outcoming-note-add-edit',
        component: OutComingNoteAddEditComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'other-in-out-note-add-edit',
        component: OtherInOutNoteAddEditComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InOutNoteRoutingModule {
}
