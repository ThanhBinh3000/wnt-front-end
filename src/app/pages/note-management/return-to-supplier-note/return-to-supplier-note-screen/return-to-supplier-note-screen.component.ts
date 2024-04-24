import { Component, ElementRef, HostListener, Injector, OnInit, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../../component/base/base.component';
import { MESSAGE, STATUS_API } from '../../../../constants/message';
import { PhieuXuatService } from '../../../../services/inventory/phieu-xuat.service';
import { NhaCungCapService } from '../../../../services/categories/nha-cung-cap.service';
import { ThuocService } from '../../../../services/products/thuoc.service';
import { LOAI_PHIEU, LOAI_SAN_PHAM } from '../../../../constants/config';
import { DrugDetailDialogComponent } from '../../../drug/drug-detail-dialog/drug-detail-dialog.component';
import { DatePipe } from '@angular/common';
import { PaymentTypeService } from '../../../../services/categories/payment-type.service';

@Component({
  selector: 'return-to-supplier-note-screen',
  templateUrl: './return-to-supplier-note-screen.component.html',
  styleUrls: ['./return-to-supplier-note-screen.component.css'],
})
export class ReturnToSupplierNoteScreenComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu trả lại hàng trả cung cấp";

  listNhaCungCaps: any[] = [];
  listThuocs: any[] = [];
  maPhieuXuat: number = 0;
  phieuXuat: any = {};
  listPaymentType: any[] = [];
  chiTietPhieus: any[] = [
  ];
  displayedColumns = [
    '#',
    'stt',
    'anh',
    'matHang',
    'donVi',
    'soLuong',
    'donGia',
    'ck',
    'vat',
    'ton',
    'thanhTien'
  ];
  expandLabel: string = "[-]";
  showMoreForm: boolean = true;
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuXuatService,
    private nhaCungCapService: NhaCungCapService,
    private thuocService: ThuocService,
    private datePipe: DatePipe,
    private paymentTypeService : PaymentTypeService
  ) {

    super(injector, _service);
    this.formData = this.fb.group({
      nhaCungCapMaNhaCungCap: [0],
      loaiXuatNhapMaLoaiXuatNhap: [LOAI_PHIEU.PHIEU_XUAT_VE_NCC],
      ngayXuat: [],
      soPhieuXuat: [0],
      tongTien: [0],
      noteDate: [],
      dienGiai:[''],
      id:[0],
      daTra:[0],
      paymentTypeId : [1],
      backPaymentAmount: [0],
      connectivityStatusID : [0],
      discount : [0],
      isModified: [false]
    });
  }
  @ViewChildren('pickerNgayXuat') pickerNgayXuat!: Date;
  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.loadDataOpt();
    if (this.maPhieuXuat == 0) {
      this.dataTable.push({ isEditingItem: true });
      let body = {
        maLoaiXuatNhap: 4,
        id: null
      }
      this.service.init(body).then((res) => {
        if (res && res.data) {
          const data = res.data;
          this.formData.controls['soPhieuXuat'].setValue(data.soPhieuXuat);
          this.formData.controls['ngayXuat'].setValue(data.ngayXuat);
        }
      });
    }
  }

  expandForm() {
    this.showMoreForm = !this.showMoreForm;
    this.expandLabel = this.showMoreForm ? '[-]' : '[+]';
  };

  loadDataOpt(){
    this.paymentTypeService.searchList({}).then((res)=>{
      this.listPaymentType = res?.data;
    });
  }
  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  async searchPageNhaCungCap($event: any) {
    if ($event.term.length >= 2) {
      let body = { textSearch: $event.term, paggingReq: {}, dataDelete: false };
      body.paggingReq = {
        limit: 25,
        page: this.page - 1
      }
      this.nhaCungCapService.searchFilterPageNhaCungCap(body).then((res) => {
        if (res?.statusCode == STATUS_API.SUCCESS) {
          this.listNhaCungCaps = res.data.content;
        }
      });
    }
  }

  async searchPageDrug($event: any) {
    if ($event.term.length >= 2) {
      let body = {
        textSearch: $event.term, paggingReq: {}, dataDelete: false,
        nhaThuocMaNhaThuoc: this.getMaNhaThuoc(), typeService: LOAI_SAN_PHAM.THUOC
      };
      body.paggingReq = {
        limit: 25,
        page: this.page - 1
      }
      this.thuocService.searchPage(body).then((res) => {
        if (res?.statusCode == STATUS_API.SUCCESS) {
          this.listThuocs = res.data.content;
        }
      });
    }
  }

  async onDrugChange(data: any) {
    if (data && data.id > 0) {
      this.thuocService.getDetail(data.id).then((res) => {
        if (res?.statusCode == STATUS_API.SUCCESS) {
          var item = res.data;
          item.isEditingItem = true;
          item.thuocThuocId = item.id;
          item.giaBan = item.heSo > 1 ? item.giaNhap * item.heSo : item.giaNhap;
          item.soLuong = 1;
          item.donViTinhMaDonViTinh = item.heSo > 1 ? item.donViThuNguyenMaDonViTinh : item.donViXuatLeMaDonViTinh;
          item.donViTinhs = [{ maDonViTinh: item.donViXuatLeMaDonViTinh, tenDonViTinh: item.tenDonViTinhXuatLe }];
          item.vat = 0;
          item.chietKhau = 0;
          item.tonHT = item.inventory ? item.inventory.lastValue : 0;
          item.ton = item.tonHT;
          item.sModified = false;
          if (item.heSo > 1) {
            item.donViTinhs.push({ maDonViTinh: item.donViThuNguyenMaDonViTinh, tenDonViTinh: item.tenDonViTinhThuNguyen });
            item.tonHT = item.ton / item.heSo;
          }
          this.getItemAmount(item);
          this.dataTable[0] = item;
        }

      });
    }
  }

  async onAddNew() {
    //kiểm tra hàng âm kho
    //kiểm tra đã có thuốc chưa
    let item = this.dataTable[0];
    if (item.ton <= 0) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.ALLOW_DELIVERY_OVER_QUANTITY);
      return;
    }
    let isExsit = false;
    this.dataTable.filter(x => !x.isEditingItem).forEach(x => {
      if (x.thuocThuocId == item.thuocThuocId && x.donViTinhMaDonViTinh == item.donViTinhMaDonViTinh && x.giaBan == item.giaBan) {
        //cong so luong
        x.soLuong = x.soLuong + item.soLuong;
        isExsit = true;
      }
    });
    if (!isExsit) {
      item.isEditingItem = false;
      item.order = this.dataTable.filter(x => !x.isEditingItem).length;
      this.dataTable.push(item);
    }
    this.dataTable[0] = { isEditingItem: true };
    this.updateTotal();
    this.focusSearchDrug();
  }

  async onChangeUnit(item: any) {
    if (item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh) {
      item.giaBan = item.giaBanLe;
      item.tonHT = item.ton * item.heSo;
    } else {
      item.giaBan = item.giaBanLe * item.heSo;
      item.tonHT = item.ton / item.heSo;
    }
  }

  async onDelete(item: any) {
    var index = this.dataTable.indexOf(item);
    if (index >= 0) {
      this.dataTable.splice(index, 1);
      let order = 1;
      this.dataTable.filter(x => !x.isEditingItem).forEach(x => {
        x.order = order;
        order++;
      });
    }
    this.updateTotal();
  }

  async updateTotal() {
    this.formData.controls['tongTien'].setValue(this.dataTable.filter(x => !x.isEditingItem)
      .reduce((acc, val) => acc += (val.tongTien), 0));
    this.formData.controls['daTra'].setValue(this.dataTable.filter(x => !x.isEditingItem)
      .reduce((acc, val) => acc += (val.tongTien), 0));
  }

  async focusSearchDrug() {
    //setTimeout(() => this.searchInput.nativeElement.focus(), 0);
  }

  async getItemAmount(item: any) {
    var discount = (item.giaBan > 0.05 ? (item.chietKhau / item.giaBan) : 0) * 100;
    console.log(discount);
    discount = discount < 0.5 ? 0 : discount;
    var vat = item.vat < 0.5 ? 0 : item.vat;
    var price = item.giaBan * (1 - (discount / 100)) * (1 + (vat / 100));
    item.tongTien = price * item.soLuong;
  }
  openDetailDialog(drugId: any) {
    this.dialog.open(DrugDetailDialogComponent, {
      data: drugId,
      width: '600px',
    });
  }

  async onDateChange(date: Date) {
    let noteDate = this.formData.get('noteDate')?.value;
    this.formData.controls['ngayXuat'].setValue(this.datePipe.transform(noteDate, 'dd/MM/yyyy HH:mm:ss') ?? '');
  }

  //save
  async onSave(){
    if(this.dataTable.filter(x=>x.thuocThuocId > 0).length == 0){
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
      return;
    }
    let body = this.formData.value;
    body.chiTiets = this.dataTable.filter(x=>x.thuocThuocId > 0);
    console.log(body);
    this.save(body).then(res=>{
      if(res){
        this.router.navigate(['/management/note-management/return-to-supplier-note-detail', res.id]);
      }
    });
  }
  
  async onPaymentFull(){
    this.formData.controls['daTra'].setValue(this.formData.get('tongTien')?.value);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch(event.key){
      case "F9":
        this.onSave();
        break;
    }
  }
}