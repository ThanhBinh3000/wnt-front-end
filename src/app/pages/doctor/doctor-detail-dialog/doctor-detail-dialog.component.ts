import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { BacSiesService } from '../../../services/medical/bac-sies.service';
import { DoctorAddEditDialogComponent } from '../doctor-add-edit-dialog/doctor-add-edit-dialog.component';

@Component({
  selector: 'doctor-detail-dialog',
  templateUrl: './doctor-detail-dialog.component.html',
  styleUrls: ['./doctor-detail-dialog.component.css'],
})
export class DoctorDetailDialogComponent extends BaseComponent implements OnInit {

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: BacSiesService,
    public dialogRef: MatDialogRef<DoctorDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public doctorId: any
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [],
      tenBacSy: [],
      dienThoai: [],
      diaChi: [],
      email: [],
    });
  }

  async ngOnInit() {
    if (this.doctorId) {
      const data = await this.detail(this.doctorId);
      this.formData.patchValue(data);
    }
  }

  async openAddEditDialog(doctorId: any) {
    const dialogRef = this.dialog.open(DoctorAddEditDialogComponent, {
      data: doctorId,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.ngOnInit();
      }
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

}