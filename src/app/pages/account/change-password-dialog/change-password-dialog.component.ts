import {Component, Injector, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {BaseComponent} from "../../../component/base/base.component";
import {MatDialogRef} from "@angular/material/dialog";
import {FormGroup, Validators} from "@angular/forms";
import {passwordValidator} from "../../../validators/password.validator";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {UserProfileService} from "../../../services/system/user-profile.service";

@Component({
  selector: 'change-password',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.css'],
})
export class ChangePasswordDialogComponent extends BaseComponent implements OnInit {

  constructor(
    injector: Injector,
    public _service: AuthService,
    public userProfileService: UserProfileService,
    public dialogRef: MatDialogRef<ChangePasswordDialogComponent>,) {
    super(injector, _service);
  }

  ngOnInit() {
    this.formData = this.fb.group({
      userId: [this.authService.getUser()?.userId],
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required, passwordValidator],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(fg: FormGroup) {
    const newPassword = fg.get('newPassword')?.value ?? '';
    const confirmPassword = fg.get('confirmPassword')?.value ?? '';
    return newPassword === confirmPassword ? null : { mismatchPassword: true };
  }

  getUserName() {
    return this.authService.getUser()?.username;
  }

  async changePassword() {
    let body = this.formData.value
    let res = await this.userProfileService.changePassword(body);
    if (res && res.statusCode == STATUS_API.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
