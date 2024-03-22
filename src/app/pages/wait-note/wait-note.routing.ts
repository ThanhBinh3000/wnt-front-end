import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { WaitNoteComponent } from './wait-note.component';
import { WaitNoteListComponent } from './wait-note-list/wait-note-list.component';
const routes: Routes = [
  {
    path: '',
    component: WaitNoteComponent,
    children: [
      {
        path: '',
        redirectTo: 'wait-note-list',
        pathMatch: 'full',
      },
      {
        path: 'wait-note-list',
        component: WaitNoteListComponent,
        // canActivate: [AuthGuard],
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WaitNoteRoutingModule {
}
