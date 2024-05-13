import { DatePipe } from '@angular/common';
import { Component, Inject, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { EsDiagnoseService } from '../../../services/categories/esdiagnose.service';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { BacSiesService } from '../../../services/medical/bac-sies.service';
import { SampleNoteService } from '../../../services/products/sample-note.service';
import { ThuocService } from '../../../services/products/thuoc.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MESSAGE } from '../../../constants/message';


@Component({
  selector: 'drug-update-info-use-dialog',
  templateUrl: './drug-update-info-use-dialog.component.html',
  styleUrls: ['./drug-update-info-use-dialog.component.css'],
})
export class DrugUpdateInfoUseDialogComponent extends BaseComponent implements OnInit {
  browserList = ['Ngày uống 3 gói chia 3 lần trước ăn sáng -trưa - tối trước khi ngủ',
    'Ngày 4 viên chia 2 lần sau ăn',
    'Ngày 1 viên sau ăn sáng',
    'Ngày 1 viên trước ăn sáng',
    'Ngày 4 viên chia 2 lần trước ăn 30 phút',
    'Đặt âm đạo 1 viên trước khi đi ngủ',
    'Ngày uống 2 viên trước sau sáng'];


  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: SampleNoteService,
    public dialogRef: MatDialogRef<DrugUpdateInfoUseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(injector, _service);
  }

  async ngOnInit() {
    console.log(this.data);
  }

  onFromDateChange() {
    var value = this.data.sampleItem.fromDate;
    this.data.sampleItem.fromDate = value.replace(/^([\d]{2})([\d]{2})([\d]{2})$/, "$1/$2/20$3");
  }

  onToDateChange() {
    var value = this.data.sampleItem.toDate;
    this.data.sampleItem.toDate = value.replace(/^([\d]{2})([\d]{2})([\d]{2})$/, "$1/$2/20$3");
  }

  updateDrugBatch() {
    const dateRegex = new RegExp('^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/([0-9]{4})$');
    var fromDate = this.data.sampleItem.fromDate;
    var toDate = this.data.sampleItem.toDate;
    const validFromDate = dateRegex.test(fromDate);
    const validToDate = dateRegex.test(toDate);
    if (!validFromDate && fromDate != '' && fromDate != null) {
      this.notification.error(MESSAGE.ERROR, "Ngày bắt đầu không hợp lệ");
      return;
    }
    if (!validToDate && toDate != '' && toDate != null) {
      this.notification.error(MESSAGE.ERROR, "Ngày kết thúc không hợp lệ");
      return;
    }
    this.dialogRef.close(this.data.sampleItem);
  }

  closeModal() {
    this.dialogRef.close();
  }

}
