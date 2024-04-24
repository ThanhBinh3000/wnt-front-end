import {Component, Injector, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {BaseComponent} from "../../../../component/base/base.component";
import {PhieuNhapService} from "../../../../services/thuchi/phieu-nhap.service";
import {LOAI_PHIEU, RECORD_STATUS} from "../../../../constants/config";
import {NhaCungCapService} from "../../../../services/categories/nha-cung-cap.service";
import {DrugAddEditDialogComponent} from "../../../drug/drug-add-edit-dialog/drug-add-edit-dialog.component";
import {ThuocService} from "../../../../services/products/thuoc.service";
import {DonViTinhService} from "../../../../services/products/don-vi-tinh.service";
import {PaymentTypeService} from "../../../../services/categories/payment-type.service";

@Component({
  selector: 'receipt-note-screen',
  templateUrl: './receipt-note-screen.component.html',
  styleUrls: ['./receipt-note-screen.component.css'],
})
export class ReceiptNoteScreenComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu nhập hàng";

  listNhaCungCap : any[] = [];
  listThuoc : any[] = [];

  rowItem : any = {
  };

  listPaymentType : any[] = [];

  constructor(
    injector: Injector,
    private titleService: Title,
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
      ngayNhap : [],
      nhaCungCapMaNhaCungCap : '',
      invoiceNo : '',
      invoiceDate : '',
      loaiXuatNhapMaLoaiXuatNhap : LOAI_PHIEU.PHIEU_NHAP,
      tongTien : [0],
      vat : '',
      daTra : [0],
      discount : [0],
      discountWithRatio : [],
      dienGiai : '',
      paymentTypeId : [0],
      tenNguoiTao : [],
    })
  }

  ngOnInit() {
    console.log(this.authService.getUser());
    this.titleService.setTitle(this.title);
    this.loadDataOpt();
    let body = {
      loaiXuatNhapMaLoaiXuatNhap : LOAI_PHIEU.PHIEU_NHAP,
      id : null
    }
    this.service.init(body).then((res)=>{
      if(res && res.data){
        const data = res.data;
        this.formData.patchValue({
          ngayNhap : data.ngayNhap,
          soPhieuNhap : data.soPhieuNhap,
          tenNguoiTao : this.authService.getUser().fullName,
        })
      }
    });
  }

  loadDataOpt(){
    this.paymentTypeService.searchList({}).then((res)=>{
      this.listPaymentType = res?.data;
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

  onChangeNhaCungCap($event){
    console.log($event)
  }

  addDrugToTable(){
    this.dataTable.push(this.rowItem);
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

  onChangeThuoc($event){
    if($event){
      this.thuocService.getDetail($event).then((res)=>{
        if(res && res.data){
          const data = res.data;
          console.log(data);
          this.rowItem.thuocThuocId = data.id,
            this.rowItem.maThuoc = data.maThuoc;
          this.rowItem.tenThuoc = data.tenThuoc;
          this.rowItem.soLuong = 1;
          this.rowItem.giaNhap = data.giaNhap;
          this.rowItem.giaBanLe = data.giaBanLe;
          this.rowItem.chietKhau = data.chietKhau;
          let rateRevenue = (data.giaBanLe - data.giaNhap) / data.giaNhap * 100 ;
          this.rowItem.rateRevenue = Math.round(rateRevenue * 100) / 100;
          this.rowItem.vat = data.vat ? data.vat : 0;
          this.rowItem.chietKhau = 0;
          this.rowItem.donViTinhMaDonViTinh = data.listDonViTinhs[0].id;
          this.rowItem.listDonViTinhs = data.listDonViTinhs;
          this.rowItem.tongTien = this.rowItem.soLuong * this.rowItem.giaNhap;
          this.rowItem.tonKho = data.inventory?.lastValue;
        }
      })
    }
  }

  onChangeDviTinh(idDviTinh,rowTable?){
    console.log(idDviTinh);
    if(rowTable){

    }else{
      let dviTinh = this.rowItem.listDonViTinhs.find(item => item.id == idDviTinh);
      console.log(dviTinh);
      this.rowItem.giaNhap = dviTinh.giaNhap;
      this.rowItem.giaBan = dviTinh.giaBan;
      // if(this.rowItem.listDonViTinhs.indexOf(dviTinh) == 0 && this.rowItem.listDonViTinhs.length > 1){
      //    = Math.round(this.rowItem.giaNhap / this.rowItem.listDonViTinhs[1].factor * 100)/100;
      // }else{
      //   this.rowItem.giaNhap = Math.round(this.rowItem.giaNhap * dviTinh.factor * 100) / 100;
      // }
      // if(this.rowItem.listDonViTinhs.indexOf(dviTinh) == 0){
      //   this.rowItem.giaBanLe =
      // }
    }
    this.calendarTongTien();
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

  createUpdate(){
    let body = this.formData.value;
    body.chiTiets = this.dataTable;
    this.save(body).then(res=>{
      if(res){
        this.router.navigate(['/management/note-management/receipt-note-detail', res.id]);
      }
    });
  }

  onDelete(data){
    console.log(data);
  }

  calendarTongTien(){
    let tongTien = 0
    this.dataTable.forEach(item => {
      tongTien += item.tongTien
    })
    this.formData.patchValue({
      tongTien : tongTien,
      daTra : tongTien
    })
    return tongTien;
  }

  onChangeDiscount($event,type){
    let tongTien = this.formData.value.tongTien;
    console.log($event,tongTien)
    if(+$event > 0 && tongTien > 0){
      let input = +$event;
      if(type == 1){
        let percent = (input/tongTien) * 100;
        this.formData.patchValue({
          discountWithRatio : percent,
          daTra : (tongTien - input)
        })
      }else{
        let discount = tongTien * (input / 100);
        this.formData.patchValue({
          discount : discount,
          daTra : tongTien - discount
        });
      }
    }
  }

  isShow = true;
  showOption(){
    this.isShow = !this.isShow;
  }

}
