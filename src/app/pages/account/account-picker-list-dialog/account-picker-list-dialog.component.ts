import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../../../component/base/base.component";
import {MatSort} from "@angular/material/sort";
import {UserProfileService} from "../../../services/system/user-profile.service";
import {STATUS_API} from "../../../constants/message";

@Component({
  selector: 'account-picker-list-dialog',
  templateUrl: './account-picker-list-dialog.component.html',
  styleUrl: './account-picker-list-dialog.component.css'
})
export class AccountPickerListDialogComponent extends BaseComponent implements OnInit, AfterViewInit {
  displayedColumns = ['#', 'userName', 'tenDayDu'];
  selectedRow: any;

  constructor(
    injector: Injector,
    public _service: UserProfileService,
    public dialogRef: MatDialogRef<AccountPickerListDialogComponent>,
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

