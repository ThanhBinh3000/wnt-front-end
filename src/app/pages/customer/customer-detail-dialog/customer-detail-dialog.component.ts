import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { CustomerAddEditDialogComponent } from '../customer-add-edit-dialog/customer-add-edit-dialog.component';
import { KhachHangService } from '../../../services/customer/khach-hang.service';

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
    public dialogRef: MatDialogRef<CustomerDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public customerId: any
  ) {
    super(injector, _service);
  }

  async ngOnInit() {
    if (this.customerId) {
      this.customerDetail = await this.detail(this.customerId);
      this.customerDetail.age = this.calculateAge(this.customerDetail.birthDate);
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

  calculateAge(dateString: string): number {
    // Chuyển chuỗi ngày sinh sang Date object
    const birthDate = new Date(dateString);
    const today = new Date();

    // Tính số năm chênh lệch giữa năm hiện tại và năm sinh
    let age = today.getFullYear() - birthDate.getFullYear();

    // Kiểm tra xem tháng/ngày của năm hiện tại có trùng hoặc vượt quá tháng/ngày của năm sinh không
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    // Điều chỉnh tuổi nếu sinh nhật của người đó chưa đến trong năm nay
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age;
  }

  closeModal() {
    this.dialogRef.close();
  }

}
