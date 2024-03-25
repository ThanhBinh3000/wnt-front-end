import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RouterOutlet} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app.routes";
import {CommonInterceptor} from "./interceptor/common.interceptor";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ComponentsModule} from "./base/components.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CommonModule, RouterOutlet, RouterOutlet, HttpClientModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ComponentsModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: CommonInterceptor,
    }],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
