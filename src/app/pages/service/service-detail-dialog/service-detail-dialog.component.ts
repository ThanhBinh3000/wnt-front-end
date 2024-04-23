import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ThuocService } from '../../../services/products/thuoc.service';
import { BaseComponent } from '../../../component/base/base.component';

@Component({
  selector: 'service-detail-dialog',
  templateUrl: './service-detail-dialog.component.html',
  styleUrls: ['./service-detail-dialog.component.css'],
})
export class ServiceDetailDialogComponent extends BaseComponent implements OnInit {
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: ThuocService,
    public dialogRef: MatDialogRef<ServiceDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public drugId: any
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [],
      tenNhomThuoc: [],
      maThuoc: [],
      tenThuoc: [],
      tenViTri: [],
      giaNhap: [],
      giaBanLe: [],
      discount: [],
      scorable: []
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