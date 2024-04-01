import {Component, Inject, Injector, OnInit} from '@angular/core';
import {NhomKhachHangService} from "../../../services/categories/nhom-khach-hang.service";
import {Validators} from "@angular/forms";
import {BaseComponent} from "../../../component/base/base.component";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'customer-group-add-edit-dialog',
  templateUrl: './customer-group-add-edit-dialog.component.html',
  styleUrls: ['./customer-group-add-edit-dialog.component.css'],
})
export class CustomerGroupAddEditDialogComponent extends BaseComponent implements OnInit {

  constructor(
    injector: Injector,
    private _service: NhomKhachHangService,
    public dialogRef: MatDialogRef<CustomerGroupAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public customerGroupID: any,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [],
      tenNhomKhachHang: ['', Validators.required],
      ghiChu: [''],
      nhaThuocMaNhaThuoc: ['0010'],
      active: [true],
      recordStatusID: [0],
      groupTypeId: [0],
      fullName: [''],
      idCard: [''],
      birthDate: [''],
      classId: [''],
      mobile: [''],
      archivedId: [0],
      storeId: [1]
    });
  }

  async ngOnInit() {
    if (this.customerGroupID) {
      const data = await this.detail(this.customerGroupID);
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
