import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TraCuuDonThuocDienTuComponent} from "./tra-cuu-don-thuoc-dien-tu.component";

const routes: Routes = [
  {
    path: '',
    component: TraCuuDonThuocDienTuComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TraCuuDonThuocDienTuRouting {
}
