import {Component, Injector, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {BaseComponent} from "../../../../component/base/base.component";
import {PhieuNhapService} from "../../../../services/thuchi/phieu-nhap.service";
import {NhaCungCapService} from "../../../../services/categories/nha-cung-cap.service";
import {ThuocService} from "../../../../services/products/thuoc.service";
import {DonViTinhService} from "../../../../services/products/don-vi-tinh.service";
import {LOAI_PHIEU, RECORD_STATUS} from "../../../../constants/config";
import {DrugAddEditDialogComponent} from "../../../drug/drug-add-edit-dialog/drug-add-edit-dialog.component";

@Component({
  selector: 'return-from-customer-note-screen',
  templateUrl: './return-from-customer-note-screen.component.html',
  styleUrls: ['./return-from-customer-note-screen.component.css'],
})
export class ReturnFromCustomerNoteScreenComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu trả lại từ khách hàng";
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
      console.log(res)
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

  addDrugToTable(){
    this.dataTable.push(this.rowItem);
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

  searchListThuoc($event){
    if($event.target.value){
      let body = {
        tenThuoc : $event.target.value,
        nhaThuocMaNhaThuoc : this.authService.getNhaThuoc().maNhaThuoc,
        recordStatusId : RECORD_STATUS.ACTIVE
      };
      this.thuocService.searchList(body).then((res)=>{
        if(res && res.data){
          this.listThuoc = res.data;
        }
      })
    }
  }

  onChangeThuoc($event){
    this.thuocService.getDetail($event).then((res)=>{
      if(res && res.data){
        const data = res.data;
        console.log(data);
        this.rowItem.maThuoc = data.maThuoc;
        this.rowItem.tenThuoc = data.tenThuoc;
        this.rowItem.soLuong = 1;
        this.rowItem.giaNhap = data.giaNhap;
        this.rowItem.giaBanLe = data.giaBanLe;
        this.rowItem.chietKhau = 0;
        this.rowItem.donViTinhMaDonViTinh = data.listDonViTinhs[0].id;
        this.rowItem.listDonViTinhs = data.listDonViTinhs;
        this.onChangeSoLuong();
      }
    })
  }

  onChangeDviTinh(idDviTinh,rowTable?){
    if(rowTable){
      let dviTinh = this.rowItem.listDonViTinhs.find(item => item.id == idDviTinh);
      this.rowItem.giaBanLe = dviTinh.giaBan;
      this.rowItem.giaNhap = dviTinh.giaNhap;
      this.onChangeSoLuong(rowTable);
    }else{
      let dviTinh = this.rowItem.listDonViTinhs.find(item => item.id == idDviTinh);
      this.rowItem.giaBanLe = dviTinh.giaBan;
      this.rowItem.giaNhap = dviTinh.giaNhap;
      this.onChangeSoLuong();
    }
    this.calendarTongTien();
  }

  addNewDrug(){
    const dialogRef = this.dialog.open(DrugAddEditDialogComponent, {
      width: '1200px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

  onChangeSoLuong(rowTable?){
    if(rowTable){
      let giaBanLe = rowTable.soLuong * rowTable.giaBanLe;
      if(rowTable.chietKhau > 0){
        giaBanLe = giaBanLe * ( ( 100 - rowTable.chietKhau ) / 100 );
      }
      rowTable.tongTien =  giaBanLe
    }else{
      let giaBanLe = this.rowItem.soLuong * this.rowItem.giaBanLe;
      if(this.rowItem.chietKhau > 0){
        giaBanLe = giaBanLe * ( ( 100 - this.rowItem.chietKhau ) / 100 );
      }
      this.rowItem.tongTien =  giaBanLe
    }
    this.calendarTongTien();
  }

  onDelete(data){
    console.log(data);
  }

  onPayFull(){
    let tongCong = this.formData.value.tongTien;
    this.formData.patchValue({
      daTra : tongCong
    })
  }

  createUpdate(){
    let body = this.formData.value;
    body.children = this.dataTable;
    console.log(body);
    this.save(body).then(res=>{
      console.log(res)
    });
  }

}
