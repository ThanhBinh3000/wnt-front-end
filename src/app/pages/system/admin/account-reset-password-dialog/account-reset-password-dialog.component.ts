import {Component, Inject, Injector, OnInit} from '@angular/core';
import {UserProfileService} from "../../../../services/system/user-profile.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../../../../component/base/base.component";
import {FormGroup, Validators} from "@angular/forms";
import {passwordValidator} from "../../../../validators/password.validator";
import {MESSAGE, STATUS_API} from "../../../../constants/message";

@Component({
  selector: 'account-reset-password-dialog',
  templateUrl: './account-reset-password-dialog.component.html',
  styleUrl: './account-reset-password-dialog.component.css'
})
export class AccountResetPasswordDialogComponent extends BaseComponent implements OnInit {

  constructor(
    injector: Injector,
    public userProfileService: UserProfileService,
    public dialogRef: MatDialogRef<AccountResetPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public userProfile: any) {
    super(injector, userProfileService);
  }

  ngOnInit() {
    this.formData = this.fb.group({
      userId: [this.userProfile.id],
      newPassword: ['', Validators.required, passwordValidator],
      confirmPassword: ['', Validators.required],
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(fg: FormGroup) {
    const newPassword = fg.get('newPassword')?.value ?? '';
    const confirmPassword = fg.get('confirmPassword')?.value ?? '';
    return newPassword === confirmPassword ? null : { mismatchPassword: true };
  }

  async resetPassword() {
    let body = this.formData.value;
    let res = await this.userProfileService.resetPassword(body);
    if (res && res.statusCode == STATUS_API.SUCCESS) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
