import {Component, Injector, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {UserProfileService} from "../../../services/system/user-profile.service";
import {MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../../../component/base/base.component";

@Component({
  selector: 'staff-permission-dialog',
  templateUrl: './staff-permission-dialog.component.html',
  styleUrls: ['./staff-permission-dialog.component.css'],
})
export class StaffPermissionDialogComponent extends BaseComponent implements OnInit {
  public display: any = {};

  constructor(
    injector: Injector,
    public authService: AuthService,
    public userProfileService: UserProfileService,
    public dialogRef: MatDialogRef<StaffPermissionDialogComponent>,) {
    super(injector, authService);
  }

  ngOnInit() {
  }

  mouseEnter(key: string, property: string) {
    this.display[key] = property;
  }

  mouseLeave(key: string, property: string) {
    this.display[key] = property;
  }

  isDisplay(key: string) {
    if(!this.display[key]){
      return 'none';
    }
    return this.display[key];
  }

  closeModal() {
    this.dialogRef.close();
  }
}
