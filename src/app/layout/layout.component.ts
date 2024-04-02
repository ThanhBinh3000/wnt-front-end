import {Component, OnInit} from '@angular/core';
import {NotificationService} from "../services/notification.service";
import {ModalService} from "../services/modal.service";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {

  constructor(
    public notificationService: NotificationService,
    private router: Router,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    if (!this.authService.getNhaThuoc()) {
      this.router.navigate(['management/account/choose-nha-thuoc']).then(r => {
      });
    }
  }

  logOut() {
  }

  closeNotification() {
    this.notificationService.close()
  }
}
