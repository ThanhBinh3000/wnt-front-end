import { Component, Inject, Injector, OnInit } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { WarehouseLocationService } from '../../../services/products/warehouse-location-service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Validators } from '@angular/forms';

@Component({
  selector: 'warehouse-location-add-edit-dialog',
  templateUrl: './warehouse-location-add-edit-dialog.component.html',
  styleUrls: ['./warehouse-location-add-edit-dialog.component.css'],
})
export class WarehouseLocationAddEditDialogComponent extends BaseComponent implements OnInit {

  constructor(
    injector: Injector,
    private _service: WarehouseLocationService,
    public dialogRef: MatDialogRef<WarehouseLocationAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public warehouseLocationID: any,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [''],
      code: [''],
      nameWarehouse: ['', Validators.required],
      maNhaThuoc: ['0010'],
      recordStatusId: [0],
      descriptions: ['']
    });
  }

  async ngOnInit() {
    if (this.warehouseLocationID) {
      const data = await this.detail(this.warehouseLocationID);
      if (data) {
        console.log(data);
        this.formData.patchValue(data);
      }
    }
  }

  async saveEdit() {
    let body = this.formData.value;
    let data = await this.save(body);
    if (data) {
      this.dialogRef.close(data);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}