import { DatePipe } from '@angular/common';
import { Component, Inject, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MESSAGE, STATUS_API } from '../../../constants/message';
import { MedicalFeeReceiptsService } from '../../../services/medical/medical-fee-receipts.service';


@Component({
  selector: 'payment-medical-note-dialog',
  templateUrl: './payment-medical-note-dialog.component.html',
  styleUrls: ['./payment-medical-note-dialog.component.css'],
})
export class PaymentMediCalNoteDialogComponent extends BaseComponent implements OnInit {
  noteFeeId: any = 0;

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: MedicalFeeReceiptsService,
    public dialogRef: MatDialogRef<PaymentMediCalNoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(injector, _service);

  }

  async ngOnInit() {
    console.log(this.data);
    this.data.discount = 0;
    this.data.totalAmount = this.data.totalMoney;
    this.data.idCus = this.data.idPatient;
    this.data.idMedical = this.data.id;
  }

  onDiscountChange() {
    this.data.totalAmount = this.data.totalMoney - this.data.discount > 0 ? this.data.totalMoney - this.data.discount : 0;
  }

  async onPayment() {
    if (this.data.totalAmount != this.data.totalMoney - this.data.discount) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng nhập đúng số tiền cần thanh toán.');
      return;
    }
    const res = await this._service.paymentMedicalNote(this.data);
    if (res && res.status == STATUS_API.SUCCESS) {
      if(res.data > 0){
        this.noteFeeId = res.data;
        this.notification.success(MESSAGE.SUCCESS, "Thanh toán thành công.");
      }
      else{
        this.notification.error(MESSAGE.ERROR, 'Thanh toán thất bại.');
      }
    }
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getMaNhaThuocCha() {
    return this.authService.getNhaThuoc().maNhaThuocCha;
  }

  closeModal() {
    this.dialogRef.close();
  }

}
