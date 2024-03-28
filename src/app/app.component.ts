import {Component} from '@angular/core';
import {SpinnerService} from "./services/spinner.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'webnhathuoc';
  constructor(public loadingService: SpinnerService) {
  }

}
