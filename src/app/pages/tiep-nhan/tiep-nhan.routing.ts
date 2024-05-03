import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TiepNhanComponent} from "./tiep-nhan.component";

const routes: Routes = [
  {
    path: '',
    component: TiepNhanComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TiepNhanRouting {
}
