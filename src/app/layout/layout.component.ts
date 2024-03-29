import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../services/notification.service";
import {ModalService} from "../services/modal.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {

  constructor(
    public notificationService: NotificationService,
    public modalService: ModalService
  ) {
  }

  ngOnInit() {
  }

  logOut() {
  }

  closeNotification() {
    this.notificationService.close()
  }

  closeModal() {
    this.modalService.close();
  }

  saveEdit() {
    this.modalService.ok();
  }
}
