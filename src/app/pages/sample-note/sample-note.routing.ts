import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { SampleNoteComponent } from './sample-note.component';
import { SampleNoteListComponent } from './sample-note-list/sample-note-list.component';
import { SampleNoteAddEditComponent } from './sample-note-add-edit/sample-note-add-edit.component';
import { SampleNoteDetailComponent } from './sample-note-detail/sample-note-detail.component';
const routes: Routes = [
  {
    path: '',
    component: SampleNoteComponent,
    children: [
      {
        path: '',
        redirectTo: 'sample-note-list',
        pathMatch: 'full',
      },
      {
        path: 'sample-note-list',
        component: SampleNoteListComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'sample-note-add-edit',
        component: SampleNoteAddEditComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'sample-note-add-edit/:id',
        component: SampleNoteAddEditComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'sample-note-detail/:id',
        component: SampleNoteDetailComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SampleNoteRoutingModule {
}
