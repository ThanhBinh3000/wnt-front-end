import { Component, Inject, Injector, OnInit, ViewChildren } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { ChuongTrinhTraThuongService } from '../../../services/categories/chuong-trinh-tra-thuongservice';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-supplier-reward-program-add-edit-dialog',
  templateUrl: './supplier-reward-program-add-edit-dialog.component.html',
  styleUrl: './supplier-reward-program-add-edit-dialog.component.css'
})
export class SupplierRewardProgramAddEditDialogComponent extends BaseComponent implements OnInit {

  constructor(
    injector: Injector,
    private _service: ChuongTrinhTraThuongService,
    public dialogRef: MatDialogRef<SupplierRewardProgramAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public object: any,
    private datePipe: DatePipe
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [0],
      content: ['', Validators.required],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    });
  }
 
  async ngOnInit() {
    if (this.object.id) {
      const data = await this.detail(this.object.id);
      if (data) {
        data.toDate = new Date(data.toDate);
        data.fromDate = new Date(data.fromDate);
        this.formData.patchValue(data);
       
      }
    }
  }
  async saveEdit() {
    let body = this.formData.value;
    if(body.fromDate){
      body.fromDate = this.datePipe.transform(body.fromDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
    }
    if(body.toDate){
      body.toDate = this.datePipe.transform(body.toDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
    }
    body.supplierId = this.object.supplierId;
    let data = await this.save(body);
    if (data) {
      this.dialogRef.close(data);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
  @ViewChildren('pickerFromDate') pickerFromCTDate!: Date;
  @ViewChildren('pickerToDate') pickerToCTDate!: Date;
}
