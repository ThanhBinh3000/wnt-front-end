import {Component, Injector, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {BaseComponent} from "../../../component/base/base.component";

@Component({
  selector: 'app-layout',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent extends BaseComponent implements OnInit {

  constructor(injector: Injector, public authService: AuthService) {
    super(injector, authService);
  }

  ngOnInit() {
    this.formData = this.fb.group({
      oldPassword: [undefined],
      newPassword: [undefined],
      confirmPassword: [undefined]
    });
  }

  getUserName() {
    return this.authService.getUser()?.username;
  }

  changePassword() {

  }
}
