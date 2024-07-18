import {Component, Injector, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {BaseComponent} from "../../../../component/base/base.component";
import {NhaCungCapService} from "../../../../services/categories/nha-cung-cap.service";
import {ThuocService} from "../../../../services/products/thuoc.service";
import {DonViTinhService} from "../../../../services/products/don-vi-tinh.service";
import {LOAI_PHIEU, RECORD_STATUS} from "../../../../constants/config";
import {PaymentTypeService} from "../../../../services/categories/payment-type.service";
import { DrugDetailDialogComponent } from '../../../drug/drug-detail-dialog/drug-detail-dialog.component';
import { SETTING } from '../../../../constants/setting';
import { PhieuNhapService } from '../../../../services/inventory/phieu-nhap.service';

@Component({
  selector: 'return-from-customer-note-detail',
  templateUrl: './return-from-customer-note-detail.component.html',
  styleUrls: ['./return-from-customer-note-detail.component.css'],
})
export class ReturnFromCustomerNoteDetailComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu khách hàng trả lại";

  // Settings
  displayImage = this.authService.getSettingByKey(SETTING.UPDATE_IMAGES_FOR_PRODUCTS).activated;
  discountByValue = this.authService.getSettingByKey(SETTING.RECEIPT_NOTE_DISCOUNT_BY_VALUE).activated;
  menuItems: any[] = []

  constructor(
    private titleService: Title,
    injector: Injector,
    private _service : PhieuNhapService,
    private nhaCungCapService : NhaCungCapService,
    private thuocService : ThuocService,
    private donViTinhService : DonViTinhService,
    private paymentTypeService : PaymentTypeService
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
      id : null,
      soPhieuNhap : [],
      noteNumber : [],
      noteDate : [],
      nhaCungCapMaNhaCungCap : [],
      idWarehouseLocation : [],
      invoiceNo : [],
      invoiceDate : [],
      loaiXuatNhapMaLoaiXuatNhap : LOAI_PHIEU.PHIEU_NHAP_TU_KH,
      tongTien : [0],
      vat : [],
      daTra : [0],
      discount : [0],
      discountWithRatio : [],
      dienGiai : [],
      ngayNhap : [],
      paymentTypeId : [0],
      locked: [false],
      tenKhachHang: [],
      tenNguoiTao: [],
      created: []
    });
  }

  getDisplayedColumns() {
    var val = ['stt', 'maThuoc', 'img', 'tenThuoc', 'donVi', 'soLuong', 'gia', 'ck', 'thanhTien'];
    if (!this.displayImage) {
      val = val.filter(e => e !== 'img');
    }
    return val;
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getId();
    this.print();
    console.log(this.idUrl);
    if(this.idUrl){
      let data = await this.detail(this.idUrl)
      console.log(data);
      this.formData.patchValue(data);
      this.dataTable = data.chiTiets;
    }
  }

  openDetailDialog(drugId: any) {
    const dialogRef = this.dialog.open(DrugDetailDialogComponent, {
      data: drugId,
      width: '600px',
    });
  }

  print(){
    this.menuItems = [
      { loaiIn: '3', label: 'Phiếu khách lẻ - 80mm', condition: true },
      { loaiIn: '1', label: 'Phiếu khách quen - A4', condition: true },
      { loaiIn: '2', label: 'Phiếu khách lẻ - A5', condition: true },
    ];
  }
}
