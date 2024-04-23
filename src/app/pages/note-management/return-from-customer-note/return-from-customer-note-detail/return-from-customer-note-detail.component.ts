import {Component, Injector, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {BaseComponent} from "../../../../component/base/base.component";
import {PhieuNhapService} from "../../../../services/thuchi/phieu-nhap.service";
import {NhaCungCapService} from "../../../../services/categories/nha-cung-cap.service";
import {ThuocService} from "../../../../services/products/thuoc.service";
import {DonViTinhService} from "../../../../services/products/don-vi-tinh.service";
import {LOAI_PHIEU, RECORD_STATUS} from "../../../../constants/config";
import {PaymentTypeService} from "../../../../services/categories/payment-type.service";

@Component({
  selector: 'return-from-customer-note-detail',
  templateUrl: './return-from-customer-note-detail.component.html',
  styleUrls: ['./return-from-customer-note-detail.component.css'],
})
export class ReturnFromCustomerNoteDetailComponent extends BaseComponent implements OnInit {
  title: string = "";
  listNhaCungCap : any[] = [];
  listThuoc : any[] = [];
  rowItem : any = {};
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
      noteNumber : '',
      noteDate : [],
      nhaCungCapMaNhaCungCap : '',
      idWarehouseLocation : '',
      invoiceNo : '',
      invoiceDate : '',
      loaiXuatNhapMaLoaiXuatNhap : LOAI_PHIEU.PHIEU_NHAP,
      tongTien : [0],
      vat : '',
      daTra : [0],
      discount : [0],
      discountWithRatio : [],
      dienGiai : '',
      ngayNhap : [],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getId();
    console.log(this.idUrl);
    if(this.idUrl){
      let data = await this.detail(this.idUrl)
      console.log(data);
      this.formData.patchValue(data);
      this.dataTable = data.chiTiets;
    }
  }

  searchListNhaCungCap($event){
    this.listNhaCungCap = [];
    if($event.target.value){
      let body = {
        tenNhaCungCap : $event.target.value,
        maNhaThuoc : this.authService.getNhaThuoc().maNhaThuoc,
        recordStatusId : RECORD_STATUS.ACTIVE
      };
      this.nhaCungCapService.searchList(body).then((res)=>{
        console.log(res)
        if(res && res.data){
          this.listNhaCungCap = res.data;
        }
      })
    }
  }

  calendarTongTien(){
    let tongTien = 0
    this.dataTable.forEach(item => {
      tongTien += item.tongTien
    })
    this.formData.patchValue({
      tongTien : tongTien
    })
    return tongTien;
  }
}
