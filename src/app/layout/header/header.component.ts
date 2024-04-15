import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from "../../services/auth.service";
import {
  ChangePasswordDialogComponent
} from "../../pages/account/change-password-dialog/change-password-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {
  DrugStoreAddEditDialogComponent
} from "../../pages/system/drug-store/drug-store-add-edit-dialog/drug-store-add-edit-dialog.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  public store: any;
  public storeName: string = '';
  public display: any = {};

  constructor(
    public authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.store = authService.getNhaThuoc();
    if (this.store) {
      this.storeName = this.store.name;
    }
  }

  ngOnInit(): void {
  }

  onRegionChanged() {

  }

  onCityChanged() {

  }

  onWardChanged() {

  }

  mouseEnter(key: string, property: string) {
    this.display[key] = property;
  }

  mouseLeave(key: string, property: string) {
    this.display[key] = property;
  }

  isDisplay(key: string) {
    if (!this.display[key]) {
      return 'none';
    }
    return this.display[key];
  }

  getFullName(){
    return this.authService.getUser()?.fullName;
  }

  getMaNhaThuoc(){
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  async openChangePasswordDialog() {
    this.dialog.open(ChangePasswordDialogComponent, {
      width: '600px',
    });
  }

  async openDrugStoreInfoDialog() {
    let maNhaThuoc = this.getMaNhaThuoc();
    this.dialog.open(DrugStoreAddEditDialogComponent, {
      data: {
        maNhaThuoc: maNhaThuoc
      },
      width: '90%',
    });
  }
}
