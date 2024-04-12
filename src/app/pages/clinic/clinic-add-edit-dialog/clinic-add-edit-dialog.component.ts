import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { PhongKhamsService } from '../../../services/medical/phong-khams.service';

@Component({
  selector: 'clinic-add-edit-dialog',
  templateUrl: './clinic-add-edit-dialog.component.html',
  styleUrl: './clinic-add-edit-dialog.component.css'
})
export class ClinicAddEditDialogComponent extends BaseComponent implements OnInit {
  constructor(
    injector: Injector,
    private _service: PhongKhamsService,
    public dialogRef: MatDialogRef<ClinicAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public clinicID: any,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [''],
      tenPhongKham: ['', Validators.required],
      description: [''],
      maNhaThuoc: ['0010'],
      recordStatusId: [0],
    });
  }

  async ngOnInit() {
    if (this.clinicID) {
      const data = await this.detail(this.clinicID);
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