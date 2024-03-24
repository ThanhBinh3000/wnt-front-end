// Trong file login.module.ts hoặc một module khác chứa AppComponent
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './login.component';
import {LoginRouting} from "./login.routing";
import {QRCodeModule} from "angularx-qrcode";
import {AuthService} from "../../services/auth.service";
import {StorageService} from "../../services/storage.service";
import {RouterModule} from "@angular/router";


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginRouting,
    QRCodeModule,
    RouterModule,
  ],
  exports: [
    LoginComponent
  ],
  providers: [AuthService, StorageService]
})
export class LoginModule {
}
