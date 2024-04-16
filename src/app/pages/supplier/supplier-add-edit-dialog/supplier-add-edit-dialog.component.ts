import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { NhaCungCapService } from '../../../services/categories/nha-cung-cap.service';
import { NhomNhaCungCapService } from '../../../services/categories/nhom-nha-cung-cap.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Validators } from '@angular/forms';
import { STATUS_API } from '../../../constants/message';

@Component({
  selector: 'supplier-add-edit-dialog',
  templateUrl: './supplier-add-edit-dialog.component.html',
  styleUrls: ['./supplier-add-edit-dialog.component.css'],
})
export class SupplierAddEditDialogComponent extends BaseComponent implements OnInit {
  @Input() isMinimized: boolean = false;
  showMoreForm: boolean = false;
  expandLabel: string = '[+]';
  listNhomNhaCungCap : any[] = [];
  constructor(
    injector: Injector,
    private _service: NhaCungCapService,
    private nhomNhaCungCapService : NhomNhaCungCapService,
    public dialogRef: MatDialogRef<SupplierAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public supplierID: any,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [0],
      tenNhaCungCap: ['', Validators.required],
      code: [''],
      soDienThoai: [''],
      diaChi : [''],
      noDauKy: [0],
      barcode: [''],
      maNhomNhaCungCap : ['', Validators.required],
      email : ['', Validators.email],
      soFax : [''],
      website : [''],
      maSoThue : [''],
      nguoiDaiDien : [''],
      nguoiLienHe : [''],
      diaBanHoatDong : [''],
    });
  }

  async ngOnInit() {
    this.getDataFilter();
    if (this.supplierID) {
      const data = await this.detail(this.supplierID);
      if (data) {
        this.formData.patchValue(data);
      }
      
    }
  }
  getDataFilter(){
    // Nhóm khách hàng
    this.nhomNhaCungCapService.searchList({}).then((res)=>{
      if(res?.statusCode == STATUS_API.SUCCESS){
        this.listNhomNhaCungCap = res.data;
        console.log(res.data);
        this.listNhomNhaCungCap.unshift({id: '', tenNhomNhaCungCap : 'Chọn nhóm nhà cung cấp'});
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