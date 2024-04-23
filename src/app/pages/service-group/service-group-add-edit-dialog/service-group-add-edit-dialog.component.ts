import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { NhomThuocService } from '../../../services/products/nhom-thuoc.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Validators } from '@angular/forms';
import { BaseComponent } from '../../../component/base/base.component';
import { LOAI_SAN_PHAM } from '../../../constants/config';

@Component({
  selector: 'service-group-add-edit-dialog',
  templateUrl: './service-group-add-edit-dialog.component.html',
  styleUrls: ['./service-group-add-edit-dialog.component.css'],
})
export class ServiceGroupAddEditDialogComponent extends BaseComponent implements OnInit {
  constructor(
    injector: Injector,
    private _service: NhomThuocService,
    public dialogRef: MatDialogRef<ServiceGroupAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public serviceGroupID: any,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id : [],
      tenNhomThuoc: ['', Validators.required],
      kyHieuNhomThuoc: [''],
      maNhaThuoc: [],
      referenceId: [0],
      storeId: [0],
      typeGroupProduct: [LOAI_SAN_PHAM.DICH_VU],
    });
  }

  async ngOnInit() {
    if (this.serviceGroupID) {
      const data = await this.detail(this.serviceGroupID);
      if (data) {
        console.log(data);
        this.formData.patchValue(data);
      }
    }
  }

   async saveEdit() {
    let body = this.formData.value;
    let data = await this.save(body);
    if(data){
      this.dialogRef.close(data);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}