import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ThuocService } from '../../../services/products/thuoc.service';
import { STATUS_API } from '../../../constants/message';

@Component({
  selector: 'multiple-warehouse-inventory-dialog',
  templateUrl: './multiple-warehouse-inventory-dialog.component.html',
  styleUrls: ['./multiple-warehouse-inventory-dialog.component.css'],
})
export class MultipleWarehouseInventoryDialogComponent extends BaseComponent implements OnInit {
  lstLastValue: any[] = [];
  lastValueAll: number = 0;
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: ThuocService,
    public dialogRef: MatDialogRef<MultipleWarehouseInventoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(injector, _service);
  }

  async ngOnInit() {
    if (this.data.thuocId) {
      let res = await this._service.getDataDetailLastValueWarehouse(this.data.thuocId);
      if (res?.status == STATUS_API.SUCCESS) {
        console.log(res.data);
        this.lstLastValue = res.data;
        this.lastValueAll = this.lstLastValue.reduce((acc, item) => acc + item.value, 0);
      }
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}