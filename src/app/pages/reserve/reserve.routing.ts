import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from "../../guard/auth.guard";
import {ReserveComponent } from './reserve.component';
import { NoteReserveAddEditComponent } from './note-reserve-add-edit/note-reserve-add-edit.component';
import { NoteReserveDetailComponent } from './note-reserve-detail/note-reserve-detail.component';
import { NoteReserveDeleteComponent } from './note-reserve-delete/note-reserve-delete.component';

const routes: Routes = [
  {
    path: '',
    component: ReserveComponent,
    children: [
      {
        path: 'add',
        component: NoteReserveAddEditComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'edit/:id',
        component: NoteReserveAddEditComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'detail/:id',
        component: NoteReserveDetailComponent,
        // canActivate: [AuthGuard],
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReserveRoutingModule {
}
