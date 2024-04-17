import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { NhomNhaCungCapService } from '../../../services/categories/nhom-nha-cung-cap.service';
import { Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'supplier-group-add-edit-dialog',
  templateUrl: './supplier-group-add-edit-dialog.component.html',
  styleUrls: ['./supplier-group-add-edit-dialog.component.css'],
})
export class SupplierGroupAddEditDialogComponent extends BaseComponent implements OnInit {

  constructor(
    injector: Injector,
    private _service: NhomNhaCungCapService,
    public dialogRef: MatDialogRef<SupplierGroupAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public supplierGroupID: any,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [],
      tenNhomNhaCungCap: ['', Validators.required],
      ghiChu: [''],
      maNhaThuoc: ['0010'],
      active: [true],
      isDefault : [true],
      archivedId : [0],
      storeId : [0],
      recordStatusId : [0]
    });
  }
 
  async ngOnInit() {
    console.log(this.supplierGroupID);
    if (this.supplierGroupID) {
      const data = await this.detail(this.supplierGroupID);
      if (data) {
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