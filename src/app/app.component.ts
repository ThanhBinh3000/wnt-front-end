import {Component} from '@angular/core';
import {SpinnerService} from "./services/spinner.service";
import {NotificationService} from "./services/notification.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'webnhathuoc';
  constructor(public loadingService: SpinnerService, public notificationService: NotificationService) {
  }

  closeNotification() {
    this.notificationService.close()
  }
}
