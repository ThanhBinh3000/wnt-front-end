import {
  Component,
  Inject,
  Injector,
  OnInit,
} from '@angular/core';
import { BaseComponent } from "../../../component/base/base.component";
import { NhomBacSiService } from '../../../services/categories/nhom-bac-si.service';
import { Validators } from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'doctor-group-add-edit-dialog',
  templateUrl: './doctor-group-add-edit-dialog.component.html',
  styleUrls: ['./doctor-group-add-edit-dialog.component.css'],
})
export class DoctorGroupAddEditDialogComponent extends BaseComponent implements OnInit {

  constructor(
    injector: Injector,
    private _service: NhomBacSiService,
    public dialogRef: MatDialogRef<DoctorGroupAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public doctorGroupId: any,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [''],
      tenNhomBacSy: ['', Validators.required],
      ghiChu: [''],
      maNhaThuoc: ['0010'],
      recordStatusId: [0],
    });
  }

  async ngOnInit() {
    if (this.doctorGroupId) {
      const data = await this.detail(this.doctorGroupId);
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