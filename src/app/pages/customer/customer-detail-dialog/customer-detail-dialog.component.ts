import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { CustomerAddEditDialogComponent } from '../customer-add-edit-dialog/customer-add-edit-dialog.component';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import {AppDatePipe} from "../../../component/pipe/app-date.pipe";
import {calculateAge} from "../../../utils/date.utils";

@Component({
  selector: 'customer-detail-dialog',
  templateUrl: './customer-detail-dialog.component.html',
  styleUrls: ['./customer-detail-dialog.component.css'],
})
export class CustomerDetailDialogComponent extends BaseComponent implements OnInit {
  customerDetail: any;
  expandLabel = '[+]';
  showMoreForm = false;
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: KhachHangService,
    private appDatePipe: AppDatePipe,
    public dialogRef: MatDialogRef<CustomerDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public customerId: any
  ) {
    super(injector, _service);
  }

  async ngOnInit() {
    if (this.customerId) {
      this.customerDetail = await this.detail(this.customerId);
      this.customerDetail.age = calculateAge(this.customerDetail.birthDate);
    }
  }

  async expandForm() {
    this.showMoreForm = !this.showMoreForm;
    this.expandLabel = this.showMoreForm ? '[-]' : '[+]';
  };

  async openAddEditDialog(customerId: any) {
    const dialogRef = this.dialog.open(CustomerAddEditDialogComponent, {
      data: customerId,
      width: '90%',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.ngOnInit();
      }
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

}
