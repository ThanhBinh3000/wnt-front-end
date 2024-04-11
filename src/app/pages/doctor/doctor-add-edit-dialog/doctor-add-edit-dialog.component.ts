import { Component, Inject, Injector, OnInit } from '@angular/core';
import { BacSiesService } from '../../../services/medical/bac-sies.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Validators } from '@angular/forms';
import { BaseComponent } from '../../../component/base/base.component';
import { NhomBacSiService } from '../../../services/categories/nhom-bac-si.service';
import { STATUS_API } from '../../../constants/message';

@Component({
  selector: 'doctor-add-edit-dialog',
  templateUrl: './doctor-add-edit-dialog.component.html',
  styleUrls: ['./doctor-add-edit-dialog.component.css'],
})
export class DoctorAddEditDialogComponent extends BaseComponent implements OnInit {
  showMoreForm: boolean = false;
  expandLabel: string = '[+]';
  listNhomBacSy : any[] = [];

  constructor(
    injector: Injector,
    private _service: BacSiesService,
    private nhomBacSiService : NhomBacSiService,
    public dialogRef: MatDialogRef<DoctorAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public doctorID: any,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [''],
      tenBacSy: ['', Validators.required],
      maNhomBacSy: [],
      diaChi: [''],
      dienThoai: [''],
      email: [],
      maNhaThuoc: [''],
      recordStatusId: [],
      connectCode: [''],
      connectPassword: [''],
    });
  }

  async ngOnInit() {
    this.getDataGroup();
    if (this.doctorID) {
      const data = await this.detail(this.doctorID);
      if (data) {
        console.log(data);
        this.formData.patchValue(data);
      }
    }
  }

  getDataGroup(){
    // Nhóm bác sỹ
    this.nhomBacSiService.searchList({}).then((res)=>{
      if(res?.statusCode == STATUS_API.SUCCESS){
        this.listNhomBacSy = res.data
      }
    });
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

  expandForm() {
    this.showMoreForm = !this.showMoreForm;
    this.expandLabel = this.showMoreForm ? '[-]' : '[+]';
  };
}