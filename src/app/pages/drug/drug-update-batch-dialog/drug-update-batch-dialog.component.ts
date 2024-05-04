import { Component, ElementRef, Inject, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ThuocService } from '../../../services/products/thuoc.service';
import { MESSAGE } from '../../../constants/message';
import { Validators } from '@angular/forms';
import { dateValidator } from '../../../validators/date.validator';
import moment from 'moment';

@Component({
  selector: 'drug-update-batch-dialog',
  templateUrl: './drug-update-batch-dialog.component.html',
  styleUrls: ['./drug-update-batch-dialog.component.css'],
})
export class DrugUpdateBatchDialogComponent extends BaseComponent implements OnInit {
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: ThuocService,
    public dialogRef: MatDialogRef<DrugUpdateBatchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public drug: any
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      tenThuoc: [drug.tenThuoc],
      maThuoc: [drug.maThuoc],
      batchNumber: [drug.batchNumber],
      expiredDate: [drug.expiredDate != '' && drug.expiredDate != null ? moment(drug.expiredDate).format('DD/MM/YYYY') : '', Validators.nullValidator, dateValidator],
      usage: [drug.usage],
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.batchInput.nativeElement.focus()
    }, 500);
  }

  @ViewChild('batchInput') batchInput!: ElementRef;

  onExpiredDateChange() {
    var value = this.formData.get('expiredDate')?.value;
    this.formData.get('expiredDate')?.setValue(value.replace(/^([\d]{2})([\d]{2})([\d]{2})$/, "$1/$2/20$3"));
  }

  updateDrugBatch() {
    const dateRegex = new RegExp('^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[012])/([0-9]{4})$');
    var expiredDate = this.formData.get('expiredDate')?.value;
    const valid = dateRegex.test(expiredDate);
    if (!valid && expiredDate != '') {
      this.notification.error(MESSAGE.ERROR, 'Hạn dùng không hợp lệ.');
      return;
    }
    this.drug.batchNumber = this.formData.get('batchNumber')?.value;
    this.drug.expiredDate = expiredDate != '' ? expiredDate + ' 00:00:00' : '';
    this.drug.usage = this.formData.get('usage')?.value;
    this.dialogRef.close(this.drug);
  }

  closeModal() {
    this.dialogRef.close();
  }

}