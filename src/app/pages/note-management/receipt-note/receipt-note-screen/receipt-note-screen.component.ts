import {Component, Injector, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {BaseComponent} from "../../../../component/base/base.component";
import {PhieuNhapService} from "../../../../services/thuchi/phieu-nhap.service";
import {LOAI_PHIEU} from "../../../../constants/config";
import {NhaCungCapService} from "../../../../services/categories/nha-cung-cap.service";
import {DrugAddEditDialogComponent} from "../../../drug/drug-add-edit-dialog/drug-add-edit-dialog.component";
import {ThuocService} from "../../../../services/products/thuoc.service";
import {DonViTinhService} from "../../../../services/products/don-vi-tinh.service";

@Component({
  selector: 'receipt-note-screen',
  templateUrl: './receipt-note-screen.component.html',
  styleUrls: ['./receipt-note-screen.component.css'],
})
export class ReceiptNoteScreenComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu nhập hàng";

  listNhaCungCap : any[] = [];
  listThuoc : any[] = [];

  rowItem : any = {};

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service : PhieuNhapService,
    private nhaCungCapService : NhaCungCapService,
    private thuocService : ThuocService,
    private donViTinhService : DonViTinhService
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
      id : null,
      idWarehouseLocation : '',
      invoiceNo : '',
      invoiceDate : '',
      loaiXuatNhapMaLoaiXuatNhap : LOAI_PHIEU.PHIEU_NHAP
    })
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
  }


  searchListNhaCungCap($event){
    this.listNhaCungCap = [];
    console.log($event.target.value);
    let body = {
      tenNhaCungCap : $event.target.value,
      maNhaThuoc : this.authService.getNhaThuoc().maNhaThuoc
  };
    this.nhaCungCapService.searchList(body).then((res)=>{
      console.log(res)
      if(res && res.data){
        this.listNhaCungCap = res.data;
      }
    })
  }

  searchListThuoc($event){
    console.log($event.target.value);
    let body = {
      tenThuoc : $event.target.value,
      nhaThuocMaNhaThuoc : this.authService.getNhaThuoc().maNhaThuoc
    };
    this.thuocService.searchList(body).then((res)=>{
      if(res && res.data){
        this.listThuoc = res.data;
      }
    })
  }

  onChangeNhaCungCap($event){
    console.log($event)
  }

  addDrugToTable(){
    this.dataTable.push(this.rowItem);
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

  onChangeThuoc($event){
    console.log($event)
    this.thuocService.getDetail($event).then((res)=>{
      console.log(res);
      if(res && res.data){
        const data = res.data;
        console.log(data);
        this.rowItem.maThuoc = data.maThuoc;
        this.rowItem.tenThuoc = data.tenThuoc;
        this.rowItem.donViTinhMaDonViTinh = data.donViTinhMaDonViTinh ;
        this.rowItem.soLuong = 0;
        this.rowItem.giaNhap = data.giaNhap;
        this.rowItem.giaBanLe = data.giaBanLe;
        this.rowItem.chietKhau = data.chietKhau;
        this.rowItem.rateRevenue = (data.giaBanLe - data.giaNhap) / data.giaNhap * 100 ;
        this.rowItem.vat = data.vat;
      }
    })
  }

  onChangePrice(rowTable?){
    if(rowTable){
      rowTable.rateRevenue = (rowTable.giaBanLe - rowTable.giaNhap) / rowTable.giaNhap * 100 ;
    }else{
      this.rowItem.rateRevenue = (this.rowItem.giaBanLe - this.rowItem.giaNhap) / this.rowItem.giaNhap * 100 ;
    }
  }

  onChangeSoLuong(rowTable?){1
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
  }

  createUpdate(){
    let body = this.formData.value;
    body.chilren = this.dataTable;
    this.save(body).then(res=>{
      console.log(res)
    });
  }

  onDelete(data){
    console.log(data);
  }

}
