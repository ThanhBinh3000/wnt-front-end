import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {LayoutComponent} from './layout.component';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from "./footer/footer.component";
import {RouterOutlet} from "@angular/router";
import {LayoutRouting} from "./layout.routing";
import {BaseComponent} from "../base/base.component";

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    BaseComponent
  ],
  imports: [CommonModule, RouterOutlet, LayoutRouting],
  exports: [],
})
export class LayoutModule {
}
