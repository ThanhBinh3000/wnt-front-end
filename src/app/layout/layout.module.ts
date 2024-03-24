import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LayoutComponent} from './layout.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from "./footer/footer.component";
import {RouterOutlet} from "@angular/router";
import {LayoutRouting} from "./layout.routing";
import {BaseComponent} from "../base/base.component";
import {DrugModule} from '../pages/drug/drug.module';
import {NhomThuocService} from "../services/categories/nhom-thuoc.service";
import {SpinnerService} from "../services/spinner.service";
import {ModalService} from "../services/modal.service";
import {UserService} from "../services/user.service";
import {AuthService} from "../services/auth.service";

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    BaseComponent
  ],
  imports: [CommonModule, RouterOutlet, LayoutRouting, DrugModule],
  providers: [NhomThuocService, SpinnerService, ModalService, UserService, AuthService],
  exports: [],
})
export class LayoutModule {
}
