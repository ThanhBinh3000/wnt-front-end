import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {BaseComponent} from "../../../../component/base/base.component";
import {PhieuXuatService} from "../../../../services/inventory/phieu-xuat.service";
import {MESSAGE, STATUS_API} from "../../../../constants/message";
import {LOAI_PHIEU} from "../../../../constants/config";
import {DrugDetailDialogComponent} from "../../../drug/drug-detail-dialog/drug-detail-dialog.component";

@Component({
  selector: 'delivery-note-detail',
  templateUrl: './delivery-note-detail.component.html',
  styleUrls: ['./delivery-note-detail.component.css'],
})
export class DeliveryNoteDetailComponent extends BaseComponent implements OnInit {
  title: string = "Trả lại hàng nhà cung cấp";
  displayedColumns = [
    'stt',
    'anh',
    'maHang',
    'tenHang',
    'donVi',
    'soLuong',
    'donGia',
    'ck',
    'vat',
    'thanhTien',
    'hanDung'
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
      khachHangMaKhachHangText: '',
      maLoaiXuatNhap: LOAI_PHIEU.PHIEU_XUAT,
      tongTien: [0],
      vat: '',
      daTra: [0],
      dienGiai: '',
      ngayXuat: [],
      chiTiets : [],
      created : [],
      createdByUserText: [],
      bacSyMaBacSyTxt: [],
      paymentTypeId : [0],
      backPaymentAmount: [0]
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

  async onLockNote(item: any){
    const res = item.locked ? await this._service.unlock(item) : await this._service.lock(item);
    if (res && res.statusCode == STATUS_API.SUCCESS) {
      item.locked = res.data.locked;
      this.notification.success(MESSAGE.SUCCESS, item.locked ? "Phiếu đã được khóa" : "Phiếu đã được mở");
    }
  }
}

