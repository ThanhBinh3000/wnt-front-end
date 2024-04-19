import {Component, Injector, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {BaseComponent} from "../../../../component/base/base.component";
import {PhieuNhapService} from "../../../../services/thuchi/phieu-nhap.service";
import {NhaCungCapService} from "../../../../services/categories/nha-cung-cap.service";
import {ThuocService} from "../../../../services/products/thuoc.service";
import {DonViTinhService} from "../../../../services/products/don-vi-tinh.service";
import {LOAI_PHIEU, RECORD_STATUS} from "../../../../constants/config";

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
    private donViTinhService : DonViTinhService
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

  ngOnInit() {
    this.titleService.setTitle(this.title);
    let body = {
      loaiXuatNhapMaLoaiXuatNhap : LOAI_PHIEU.PHIEU_NHAP_TU_KH,
      id : null
    }
    this.service.init(body).then((res)=>{
      if(res && res.data){
        const data = res.data;
        this.formData.patchValue({
          ngayNhap : data.ngayNhap,
          soPhieuNhap : data.soPhieuNhap
        })
      }
    });
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

  onChangePrice(rowTable?){
    if(rowTable){
      rowTable.rateRevenue = (rowTable.giaBanLe - rowTable.giaNhap) / rowTable.giaNhap * 100 ;
    }else{
      let rateRevenue = (this.rowItem.giaBanLe - this.rowItem.giaNhap) / this.rowItem.giaNhap * 100 ;
      this.rowItem.rateRevenue = Math.round(rateRevenue * 100) / 100;
    }
    this.calendarTongTien();
  }

  onChangeSoLuong(rowTable?){
    if(rowTable){
      let giaNhap = rowTable.soLuong * rowTable.giaNhap;
      if(rowTable.chietKhau > 0){
        giaNhap = giaNhap * ( ( 100 - rowTable.chietKhau ) / 100 );
      }
      if(rowTable.vat > 0){
        giaNhap = giaNhap + ( giaNhap * (rowTable.vat / 100));
      }
      rowTable.tongTien =  giaNhap
    }else{
      let giaNhap = this.rowItem.soLuong * this.rowItem.giaNhap;
      if(this.rowItem.chietKhau > 0){
        giaNhap = giaNhap * ( ( 100 - this.rowItem.chietKhau ) / 100 );
      }
      if(this.rowItem.vat > 0){
        giaNhap = giaNhap + ( giaNhap * (this.rowItem.vat / 100));
      }
      this.rowItem.tongTien =  giaNhap
    }
    this.calendarTongTien();
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
