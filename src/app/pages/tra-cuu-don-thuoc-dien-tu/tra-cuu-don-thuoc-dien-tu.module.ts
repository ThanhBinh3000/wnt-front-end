import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {TraCuuDonThuocDienTuComponent} from './tra-cuu-don-thuoc-dien-tu.component';
import {TraCuuDonThuocDienTuRouting} from "./tra-cuu-don-thuoc-dien-tu.routing";
import {RouterModule} from "@angular/router";
import {QRCodeModule} from "angularx-qrcode";

@NgModule({
  declarations: [
    TraCuuDonThuocDienTuComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TraCuuDonThuocDienTuRouting,
    RouterModule,
  ],
  exports: [
    TraCuuDonThuocDienTuComponent
  ],
  providers: []
})
export class TraCuuDonThuocDienTuModule {
}
