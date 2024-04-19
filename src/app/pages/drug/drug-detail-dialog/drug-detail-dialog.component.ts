import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ThuocService } from '../../../services/products/thuoc.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'drug-detail-dialog',
  templateUrl: './drug-detail-dialog.component.html',
  styleUrls: ['./drug-detail-dialog.component.css'],
})
export class DrugDetailDialogComponent extends BaseComponent implements OnInit {

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: ThuocService,
    public dialogRef: MatDialogRef<DrugDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public drugId: any
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [],
      maThuoc: [],
      tenThuoc: [],
      tenViTri: [],
      barCode: [],
      hangTuVan: [],
      advantages: [],
      userObject: [],
      donViXuatLeMaDonViTinh: [],
      tenDonViTinhXuatLe: [],
      donViThuNguyenMaDonViTinh: [],
      tenDonViTinhThuNguyen: [],
      heSo: [],
      giaNhap: [],
      giaBanLe: [],
      giaBanBuon: [],
      soDuDauKy: [],
      gioiHan: []
    });
  }

  async ngOnInit() {
    if (this.drugId) {
      const data = await this.detail(this.drugId);
      this.formData.patchValue(data);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
  

}