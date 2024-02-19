// Trong file login.module.ts hoặc một module khác chứa AppComponent
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {LoginComponent} from './login.component';
import {LoginRouting} from "./login.routing";
import {SocketService} from "./socket.service";
import {QRCodeModule} from "angularx-qrcode";


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginRouting,
    QRCodeModule
  ],
  exports: [
    LoginComponent
  ],
  providers: [SocketService]
})
export class LoginModule {
}
