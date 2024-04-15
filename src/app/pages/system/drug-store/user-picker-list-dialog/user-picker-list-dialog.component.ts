import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {BankAccountService} from "../../../../services/categories/bank-account.service";
import {BaseComponent} from "../../../../component/base/base.component";
import {
  BankAccountAddEditDialogComponent
} from "../bank-account-add-edit-dialog/bank-account-add-edit-dialog.component";
import {MatSort} from "@angular/material/sort";
import {UserProfileService} from "../../../../services/system/user-profile.service";
import {STATUS_API} from "../../../../constants/message";

@Component({
  selector: 'user-picker-list-dialog',
  templateUrl: './user-picker-list-dialog.component.html',
  styleUrl: './user-picker-list-dialog.component.css'
})
export class UserPickerListDialogComponent extends BaseComponent implements OnInit, AfterViewInit {
  displayedColumns = ['#', 'userName', 'tenDayDu'];
  selectedRow: any;

  constructor(
    injector: Injector,
    public _service: UserProfileService,
    public dialogRef: MatDialogRef<UserPickerListDialogComponent>,
  ) {
    super(injector, _service);
    this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });
    this.formData = this.fb.group({
      textSearch: ['']
    });
  }

  async ngOnInit() {
    await this.searchPageUserManagement();
  }

  @ViewChild(MatSort) sort?: MatSort;
  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  async searchPageUserManagement() {
    let body = this.formData.value;
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this._service.searchPageUserManagement(body);
    if (res?.statusCode == STATUS_API.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      this.totalPages = data.totalPages;

    } else {
      this.dataTable = [];
      this.totalRecord = 0;
    }
  }

  closeModal() {
    this.dialogRef.close(this.selectedRow);
  }
}

