import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "../../guard/auth.guard";
import { RegionInformationComponent } from './region-information.component';
const routes: Routes = [
  {
    path: '',
    component: RegionInformationComponent,
    children: [
      
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegionInformationRoutingModule {
}
