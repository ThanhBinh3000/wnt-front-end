import {Component, Inject, Injector, OnInit} from '@angular/core';
import {BaseComponent} from "../../../component/base/base.component";
import {UserProfileService} from "../../../services/system/user-profile.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormGroup, Validators} from "@angular/forms";
import {passwordValidator} from "../../../validators/password.validator";
import {phoneNumberValidator} from "../../../validators/phone-number.validator";
import {MESSAGE, STATUS_API} from "../../../constants/message";

@Component({
  selector: 'staff-add-edit-dialog',
  templateUrl: './staff-add-edit-dialog.component.html',
  styleUrls: ['./staff-add-edit-dialog.component.css'],
})
export class StaffAddEditDialogComponent extends BaseComponent implements OnInit {

  constructor(
    injector: Injector,
    public userProfileService: UserProfileService,
    public dialogRef: MatDialogRef<StaffAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public userProfile: any) {
    super(injector, userProfileService);
    this.formData = this.fb.group({
      id: [],
      userName: ['', userProfile ? null : Validators.required],
      password: ['', userProfile ? null : Validators.required, userProfile ? null : passwordValidator],
      confirmPassword: ['', userProfile ? null : Validators.required],
      tenDayDu: ['', Validators.required],
      email: ['', Validators.email],
      soDienThoai: ['', Validators.required, phoneNumberValidator],
      soCMT: [''],
      hoatDong: [false],
      addresses: [''],
      archivedId: [0],
      storeId: [0],
      regionId: [0],
      cityId: [0],
      wardId: [0],
      isVerificationAccount: [false]
    }, { validators: userProfile ? null : this.passwordMatchValidator });
  }

  passwordMatchValidator(fg: FormGroup) {
    const newPassword = fg.get('password')?.value ?? '';
    const confirmPassword = fg.get('confirmPassword')?.value ?? '';
    return newPassword === confirmPassword ? null : { mismatchPassword: true };
  }

  async ngOnInit() {
    if (this.userProfile) {
      const data = await this.detail(this.userProfile.id);
      if (data) {
        this.userProfile = Object.assign({}, this.userProfile, data);
        this.formData.patchValue(this.userProfile);
      }
    }
  }

  async saveEdit() {
    let body = this.formData.value;
    let res;
    if (body.id && body.id > 0) {
      res = await this.userProfileService.updateStaff(body);
    } else {
      res = await this.userProfileService.createStaff(body);
    }
    if (res && res.statusCode == STATUS_API.SUCCESS) {
      if (body.id && body.id > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
      }
    }
    if (res?.data) {
      this.dialogRef.close(res?.data);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
