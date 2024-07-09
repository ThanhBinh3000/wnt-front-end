import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ThuocsComponent} from "./Thuocs.component";
import {InMaVachComponent} from "./InMaVach/InMaVach.component";

const routes: Routes = [
  {
    path: '',
    component: ThuocsComponent,
    children: [
      {
        path: 'InMaVach',
        component: InMaVachComponent,
      },
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThuocsRoutingModule {
}
