import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {TraCuuDonThuocDienTuComponent} from './tra-cuu-don-thuoc-dien-tu.component';
import {TraCuuDonThuocDienTuRouting} from "./tra-cuu-don-thuoc-dien-tu.routing";
import {RouterModule} from "@angular/router";
import { ChiTietDonDienTuDialogComponent } from './chi-tiet-don-dien-tu-dialog/chi-tiet-don-dien-tu-dialog.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    TraCuuDonThuocDienTuComponent,
    ChiTietDonDienTuDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TraCuuDonThuocDienTuRouting,
    RouterModule,
    NgSelectModule
  ],
  exports: [
    TraCuuDonThuocDienTuComponent
  ],
  providers: []
})
export class TraCuuDonThuocDienTuModule {
}
