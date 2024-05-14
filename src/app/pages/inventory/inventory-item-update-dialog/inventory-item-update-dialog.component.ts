import { Component, Inject, Injector, Input, OnInit, ViewChildren } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { PhieuKiemKeService } from '../../../services/products/phieu-kiem-ke.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MESSAGE } from '../../../constants/message';

@Component({
  selector: 'inventory-item-update-dialog',
  templateUrl: './inventory-item-update-dialog.component.html',
  styleUrl: './inventory-item-update-dialog.component.css'
})
export class InventoryItemUpdateDialogComponent extends BaseComponent implements OnInit {
  constructor(
    injector: Injector,
    private _service: PhieuKiemKeService,
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
    this.notification.success(MESSAGE.SUCCESS, 'Cập nhật thành công');
    this.dialogRef.close();
  }
}
