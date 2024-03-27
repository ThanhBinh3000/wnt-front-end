import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../services/notification.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {

  constructor(public notificationService: NotificationService) {
  }

  ngOnInit() {
  }

  logOut() {
  }

  closeNotification() {
    this.notificationService.close()
  }
}
