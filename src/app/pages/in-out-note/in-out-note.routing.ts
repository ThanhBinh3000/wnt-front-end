import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { InOutNoteComponent } from './in-out-note.component';
import { InOutNoteListComponent } from './in-out-note-list/in-out-note-list.component';
const routes: Routes = [
  {
    path: '',
    component: InOutNoteComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: InOutNoteListComponent,
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
