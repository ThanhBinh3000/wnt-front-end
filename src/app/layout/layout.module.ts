import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LayoutComponent} from './layout.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from "./footer/footer.component";
import {RouterOutlet} from "@angular/router";
import {MainRoutingModule} from "./main-routing.module";

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [CommonModule, RouterOutlet, MainRoutingModule],
  exports: [],
})
export class LayoutModule {
}
