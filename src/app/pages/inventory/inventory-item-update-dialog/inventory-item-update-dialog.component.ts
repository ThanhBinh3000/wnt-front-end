import { Component, Inject, Injector, Input, OnInit, ViewChildren } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { PhieuKiemKeService } from '../../../services/products/phieu-kiem-ke.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MESSAGE, STATUS_API } from '../../../constants/message';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'inventory-item-update-dialog',
  templateUrl: './inventory-item-update-dialog.component.html',
  styleUrl: './inventory-item-update-dialog.component.css'
})
export class InventoryItemUpdateDialogComponent extends BaseComponent implements OnInit {
  constructor(
    injector: Injector,
    private _service: PhieuKiemKeService,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<InventoryItemUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public object: any
  ) {
    super(injector, _service);
  }

  ngOnInit() {
  }
   
  @ViewChildren('pickerHanDung') pickerHanDung!: Date;

  closeModal() {
    this.dialogRef.close();
  }

  updateDrugBatch(){
    console.log(this.object);
    if(this.object.id > 0){
      this._service.capNhatHanDung(
        {
          donGia : this.object.donGia,
          id: this.object.id,
          hanDung: this.object.hanDung ? this.datePipe.transform(this.object.hanDung, 'dd/MM/yyyy HH:mm:ss') : '',
          soLo : this.object.soLo
        }
      ).then((res)=>{
        if(res?.status == STATUS_API.SUCCESS){
          this.notification.success(MESSAGE.SUCCESS, 'Cập nhật thành công');
        }else{
          this.notification.error(MESSAGE.ERROR, 'Gặp lỗi trong quá trình cập nhật');
        }
      });
    }else{
      this.notification.success(MESSAGE.SUCCESS, 'Cập nhật thành công');
    }
    //this.dialogRef.close();
  }
}
