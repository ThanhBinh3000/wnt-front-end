import { Component, Inject, Injector, OnInit } from '@angular/core';
import { DonViTinhService } from '../../../services/products/don-vi-tinh.service';
import { BaseComponent } from '../../../component/base/base.component';
import { Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: 'drug-unit-add-edit-dialog',
  templateUrl: './drug-unit-add-edit-dialog.component.html',
  styleUrls: ['./drug-unit-add-edit-dialog.component.css'],
})
export class DrugUnitAddEditDialogComponent extends BaseComponent implements OnInit {

  constructor(
    injector: Injector,
    private _service: DonViTinhService,
    public dialogRef: MatDialogRef<DrugUnitAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public drugUnitID: any,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [''],
      tenDonViTinh: ['', Validators.required],
      maNhaThuoc: ['0010'],
      recordStatusId: [0],
      referenceId: [0],
      archivedId: [0],
      storeId: [0]
    });
  }

  async ngOnInit() {
    if (this.drugUnitID) {
      const data = await this.detail(this.drugUnitID);
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