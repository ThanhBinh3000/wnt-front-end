import { Component, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../../component/base/base.component';
import { PhieuXuatService } from '../../../../services/inventory/phieu-xuat.service';
import { NhaCungCapService } from '../../../../services/categories/nha-cung-cap.service';
import { STATUS_API } from '../../../../constants/message';
import { ActivatedRoute } from '@angular/router';
import { LOAI_PHIEU } from '../../../../constants/config';
import { DrugDetailDialogComponent } from '../../../drug/drug-detail-dialog/drug-detail-dialog.component';

@Component({
  selector: 'return-to-supplier-note-detail',
  templateUrl: './return-to-supplier-note-detail.component.html',
  styleUrls: ['./return-to-supplier-note-detail.component.css'],
})
export class ReturnToSupplierNoteDetailComponent extends BaseComponent implements OnInit {
  title: string = "Trả lại hàng nhà cung cấp";
  displayedColumns = [
    'stt',
    'anh',
    'maHang',
    'tenHang',
    'donVi',
    'soLuong',
    'donGia',
    'vat',
    'thanhTien'
  ];
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuXuatService
  ) {

    super(injector, _service);
    this.formData = this.fb.group({
      id: null,
      soPhieuXuat: [],
      noteNumber: '',
      noteDate: [],
      nhaCungCapMaNhaCungCapText: '',
      maLoaiXuatNhap: LOAI_PHIEU.PHIEU_TRA_LAI_NCC,
      tongTien: [0],
      vat: '',
      daTra: [0],
      dienGiai: '',
      ngayXuat: [],
      chiTiets : [],
      created : [],
      createdByUserText: []
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getId();
    if (this.idUrl) {
      let data = await this.detail(this.idUrl)
      console.log(data);
      this.formData.patchValue(data);
      this.dataTable = data.chiTiets;
      this.dataTable.forEach(x=>{
        this.getItemAmount(x);
      });
    }
  }
  openDetailDialog(drugId: any) {
    this.dialog.open(DrugDetailDialogComponent, {
      data: drugId,
      width: '600px',
    });
  }
  async getItemAmount(item: any) {
    let discount = (item.giaXuat > 0.05 ? (item.chietKhau / item.giaXuat) : 0) * 100;
    console.log(item);
    discount = discount < 0.5 ? 0 : discount;
    let vat = item.vat < 0.5 ? 0 : item.vat;
    let price = item.giaXuat * (1 - (discount / 100)) * (1 + (vat / 100));
    item.tongTien = price * item.soLuong;
  }
}
