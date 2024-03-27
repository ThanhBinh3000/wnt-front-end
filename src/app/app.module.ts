import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RouterOutlet} from "@angular/router";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppComponent} from "./app.component";
import {AppRoutingModule} from "./app.routes";
import {CommonInterceptor} from "./interceptor/common.interceptor";
import {BrowserModule} from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {ComponentsModule} from "./component/base/components.module";
import {DrugGroupModule} from "./pages/drug-group/drug-group.module";

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        CommonModule, RouterOutlet, RouterOutlet, HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        ComponentsModule, DrugGroupModule],
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
