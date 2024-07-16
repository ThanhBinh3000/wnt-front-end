import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UtilitiesComponent } from './utilities.component';
import {OperatingTargetComponent} from "./OperatingTarget/OperatingTarget.component";
const routes: Routes = [
  {
    path: '',
    component: UtilitiesComponent,
    children: [
      {
        path: 'OperatingTarget',
        component: OperatingTargetComponent
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UtilitiesRoutingModule {
}
