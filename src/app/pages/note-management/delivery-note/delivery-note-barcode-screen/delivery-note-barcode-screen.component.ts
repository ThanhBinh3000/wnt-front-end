import {Component, ElementRef, HostListener, Injector, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {BaseComponent} from "../../../../component/base/base.component";
import {PhieuXuatService} from "../../../../services/inventory/phieu-xuat.service";
import {ThuocService} from "../../../../services/products/thuoc.service";
import {DatePipe} from "@angular/common";
import {PaymentTypeService} from "../../../../services/categories/payment-type.service";
import {LOAI_PHIEU, LOAI_SAN_PHAM} from "../../../../constants/config";
import {MESSAGE, STATUS_API} from "../../../../constants/message";
import {DrugDetailDialogComponent} from "../../../drug/drug-detail-dialog/drug-detail-dialog.component";
import {NgSelectComponent} from "@ng-select/ng-select";
import {KhachHangService} from "../../../../services/customer/khach-hang.service";
import {BacSiesService} from "../../../../services/medical/bac-sies.service";
import {SETTING} from "../../../../constants/setting";

@Component({
  selector: 'delivery-note-barcode-screen',
  templateUrl: './delivery-note-barcode-screen.component.html',
  styleUrls: ['./delivery-note-barcode-screen.component.css'],
})
export class DeliveryNoteBarcodeScreenComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu bán hàng với mã vạch";

  listKhachHangs: any[] = [];
  listBacSys: any[] = [];
  listThuocs: any[] = [];
  listPaymentType: any[] = [];
  expandLabel: string = "[-]";
  showMoreForm: boolean = true;
  maKhachHangLe : number = 0;
  totalScore: number = 0;
  totalDebtAmount: number = 0;
  debtValue: number = 0;
  debtLabel: string = 'Còn nợ';

  notAllowDeliverOverQuantity: any = {
    activated : this.authService.getSettingActivated(SETTING.NOT_ALLOW_DELIVER_OVER_QUANTITY)
  };
  allowChangeTotalAmountInDeliveryNote : any={
    activated : this.authService.getSettingActivated(SETTING.ALLOW_CHANGE_TOTAL_AMOUNT_IN_DELIVERY_NOTE)
  } ;
  updateImagesForProducts : any ={
    activated : this.authService.getSettingActivated(SETTING.UPDATE_IMAGES_FOR_PRODUCTS)
  };
  moneyPerScoreRate : any = {
    activated : this.authService.getSettingValue(SETTING.MONEY_PER_SCORE_RATE),
    value : this.authService.getSettingValue(SETTING.MONEY_PER_SCORE_RATE)
  };

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuXuatService,
    private khachHangService: KhachHangService,
    private thuocService: ThuocService,
    private bacsyService : BacSiesService,
    private datePipe: DatePipe,
    private paymentTypeService: PaymentTypeService,
    private pxService: PhieuXuatService
  ) {

    super(injector, _service);
    this.formData = this.fb.group({
      khachHangMaKhachHang: [0],
      maLoaiXuatNhap: [LOAI_PHIEU.PHIEU_XUAT],
      ngayXuat: [],
      soPhieuXuat: [0],
      tongTien: [0],
      noteDate: [],
      dienGiai: [''],
      id: [0],
      daTra: [0],
      paymentTypeId: [0],
      backPaymentAmount: [0],
      connectivityStatusID: [0],
      discount: [0],
      isModified: [false],
      orderId: [0],
      paymentScore: [0],
      paymentScoreAmount: [0],
      storeId: [0],
      vat: [0],
      createdByUserText: [''],
      created: [],
      recordStatusId: [0],
      bacSyMaBacSy: [0],
      doseNumber:[1]
    });
  }

  @ViewChildren('pickerNgayXuat') pickerNgayXuat!: Date;

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.loadDataOpt();
    let body = {
      maLoaiXuatNhap: LOAI_PHIEU.PHIEU_XUAT,
      id: null
    }
    this.service.init(body).then((res) => {
      if (res && res.data) {
        const data = res.data;
        this.maKhachHangLe = data.khachHangMaKhachHang;
        this.formData.controls['soPhieuXuat'].setValue(data.soPhieuXuat);
        this.formData.controls['ngayXuat'].setValue(data.ngayXuat);
        this.formData.controls['khachHangMaKhachHang'].setValue(this.maKhachHangLe);
        this.listKhachHangs = [{id: data.khachHangMaKhachHang, tenKhachHang: 'Khách lẻ', diaChi : '', soDienThoai : ''}];
      }
    });
    await this.searchListBacSy();
  }

  ngAfterViewInit() {
    this.focusSearchDrug();
  }

  expandForm() {
    this.showMoreForm = !this.showMoreForm;
    this.expandLabel = this.showMoreForm ? '[-]' : '[+]';
  };

  loadDataOpt() {
    this.paymentTypeService.searchList({}).then((res) => {
      this.listPaymentType = res?.data;
    });
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  async searchPageKhachHang($event: any) {
    if ($event.term.length >= 2) {
      let body = {textSearch: $event.term, paggingReq: {}, dataDelete: false,
        nhaThuocMaNhaThuoc: this.getMaNhaThuoc()};
      body.paggingReq = {
        limit: 25,
        page: 0
      }
      this.khachHangService.searchPage(body).then((res) => {
        if (res?.statusCode == STATUS_API.SUCCESS) {
          this.listKhachHangs = res.data.content;
          this.listKhachHangs.push({id: this.maKhachHangLe, tenKhachHang: 'Khách lẻ'});
        }
      });
    }
  }

  async searchListBacSy() {
    let body = {dataDelete: false, maNhaThuoc: this.getMaNhaThuoc()};
    this.bacsyService.searchList(body).then((res) => {
      if (res?.statusCode == STATUS_API.SUCCESS) {
        this.listBacSys = res.data;
      }
    });
  }


  async searchPageDrug($event: any) {
    if ($event.term.length >= 2) {
      let body = {
        textSearch: $event.term, paggingReq: {}, dataDelete: false,
        nhaThuocMaNhaThuoc: this.getMaNhaThuoc(), typeService: LOAI_SAN_PHAM.THUOC
      };
      body.paggingReq = {
        limit: 25,
        page: 0
      }
      this.thuocService.searchPage(body).then((res) => {
        if (res?.statusCode == STATUS_API.SUCCESS) {
          this.listThuocs = res.data.content;
        }
      });
    }
  }
  @ViewChild(NgSelectComponent) ngSelectComponent!: NgSelectComponent;

  // Call to clear

  async onDrugChange(data: any) {
    if (data && data.id > 0) {
      this.thuocService.getDetail(data.id).then((res) => {
        if (res?.statusCode == STATUS_API.SUCCESS) {
          let item = res.data;
          item.isEditingItem = true;
          item.thuocThuocId = item.id;
          item.giaXuat = item.heSo > 1 ? item.giaNhap * item.heSo : item.giaNhap;
          item.soLuong = 1;
          item.donViTinhMaDonViTinh = item.heSo > 1 ? item.donViThuNguyenMaDonViTinh : item.donViXuatLeMaDonViTinh;
          item.donViTinhs = item.listDonViTinhs;
          item.vat = 0;
          item.chietKhau = 0;
          item.retailPrice = item.giaNhap;
          item.tonHT = item.inventory ? item.inventory.lastValue : 0;
          item.ton = item.tonHT;
          item.isModified = false;
          item.isProdRef = false;
          item.id = 0;
          item.maThuocText = item.maThuoc;
          item.tenThuocText = item.tenThuoc;
          item.connectivityStatusId = 0;
          item.referenceId = 0;
          item.storeId = 0;
          item.recordStatusId = 0;
          if (item.heSo > 1) {
            item.tonHT = item.ton / item.heSo;
          }
          this.getItemAmount(item);
          this.onAddNew(item);
        }
      });
    }
  }

  async onAddNew(item: any) {
    //kiểm tra hàng âm kho
    if (item.ton <= 0 && this.notAllowDeliverOverQuantity) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.ALLOW_DELIVERY_OVER_QUANTITY);
      return;
    }
    let isExsit = false;
    this.dataTable.forEach(x => {
      if (x.thuocThuocId == item.thuocThuocId && x.donViTinhMaDonViTinh == item.donViTinhMaDonViTinh && x.giaXuat == item.giaXuat) {
        //cong so luong
        x.soLuong = x.soLuong + item.soLuong;
        isExsit = true;
      }
    });
    if (!isExsit) {
      item.isEditingItem = false;
      item.itemOrder = this.dataTable.length + 1;
      console.log(item);
      this.dataTable.push(item);
    }
    this.updateTotal();
    this.ngSelectComponent.handleClearClick();
    setTimeout(() => this.focusSearchDrug(), 100);
  }

  async onChangeUnit(item: any) {
    if (item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh) {
      item.giaXuat = item.giaNhap;
      item.tonHT = item.ton * item.heSo;
    } else {
      item.giaXuat = item.giaNhap * item.heSo;
      item.tonHT = item.ton / item.heSo;
    }
    await this.getItemAmount(item);
  }

  async onDelete(item: any) {
    var index = this.dataTable.indexOf(item);
    if (index >= 0) {
      this.dataTable.splice(index, 1);
      let order = 1;
      this.dataTable.filter(x => !x.isEditingItem).forEach(x => {
        x.itemOrder = order;
        order++;
      });
    }
    this.updateTotal();
  }

  updateTotal() {
    this.formData.controls['tongTien'].setValue(this.dataTable.filter(x => !x.isEditingItem)
      .reduce((acc, val) => acc += (val.tongTien), 0));
    this.formData.controls['daTra'].setValue(this.dataTable.filter(x => !x.isEditingItem)
      .reduce((acc, val) => acc += (val.tongTien), 0));
  }

  async getItemAmount(item: any) {
    let discount = (item.giaXuat > 0.05 ? (item.chietKhau / item.giaXuat) : 0) * 100;
    discount = discount < 0.5 ? 0 : discount;
    let vat = item.vat < 0.5 ? 0 : item.vat;
    let price = item.giaXuat * (1 - (discount / 100)) * (1 + (vat / 100));
    item.tongTien = price * item.soLuong;
    item.retailQuantity = item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh ? item.soLuong : item.soLuong * item.heSo;
    item.retailPrice = item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh ? item.giaXuat : item.giaXuat / item.heSo;
    this.updateTotal();
    await this.updateQuantityByDose(item, false);
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
  async onSave() {
    if (this.dataTable.filter(x => x.thuocThuocId > 0).length == 0) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
      return;
    }
    let body = this.formData.value;
    if (this.dataTable.length == 1 && this.dataTable[0].isEditingItem) {
      await this.onAddNew(this.dataTable[0])
    }
    body.chiTiets = this.dataTable.filter(x => x.thuocThuocId > 0);
    this.save(body).then(res => {
      if (res) {
        this.router.navigate(['/management/note-management/delivery-note-detail', res.id]);
      }
    });
  }

  async onPaymentFull() {
    let paymentScoreAmount = 0;
    let paymentScore = this.formData.get('paymentScore')?.value;
    let totalAmount = this.formData.get('tongTien')?.value;
    let discount = this.formData.get('discount')?.value;
    if (paymentScore > 0.5 && this.moneyPerScoreRate.value > 0.5) {
      paymentScoreAmount = Math.round(paymentScore * this.moneyPerScoreRate.value);
    }
    this.formData.controls['paymentScoreAmount'].setValue(paymentScoreAmount);

    var paymentAmount = Math.round(totalAmount - discount - paymentScoreAmount);
    if (paymentAmount < 0.5) {
      paymentAmount = 0;
    }
    this.formData.controls['daTra'].setValue(paymentAmount);

  }

  @ViewChildren('inputSoLuong') inputSoLuongs!: QueryList<ElementRef>;

  async focusInputSoLuong() {
    if (this.inputSoLuongs.last) {
      this.inputSoLuongs.last.nativeElement.focus();
    }
  }

  @ViewChild('selectDrug') selectDrug!: NgSelectComponent;

  async focusSearchDrug() {
    this.selectDrug?.focus();
  }

  async onChangeDoseNumber() {
    if(this.dataTable.length == 0) return;
    this.dataTable.forEach(item => {
      this.updateQuantityByDose(item, true);
    });
  }

  //tính liều
  async updateQuantityByDose(item: any, update: boolean = false){
    let doseNumber = this.formData.get('doseNumber')?.value;
    if(update){
      item.soLuong = doseNumber * item.quantityPerOneDose;
    }else {
      item.quantityPerOneDose = item.soLuong;
      if (doseNumber > 1.0) {
        item.quantityPerOneDose = item.soLuong / doseNumber;
      }
    }
  }

  //điểm khach hang
  async onPaymentScoreChange(){
    let paymentScore = this.formData.get('paymentScore')?.value;
    if(paymentScore > this.totalScore){
      this.formData.controls['paymentScore'].setValue(0);
    }
    await this.onPaymentFull();
  }

  getDebtAmount(){
    let totalAmount = this.formData.get('tongTien')?.value;
    let paymentAmount = this.formData.get('daTra')?.value;
    let discount = this.formData.get('discount')?.value;
    let paymentScoreAmount = this.formData.get('paymentScoreAmount')?.value;
    this.debtValue = totalAmount - (paymentAmount + discount + paymentScoreAmount);
    this.debtLabel = this.debtValue < 0 ? 'Tiền thừa' : 'Còn nợ';
    return Math.abs(this.debtValue);
  }

  getDisplayedColumns(){
    let displayedColumns = [
      '#',
      'stt',
      'anh',
      'maHang',
      'tenHang',
      'donVi',
      'soLuong',
      'donGia',
      'ton',
      'thanhTien'
    ];
    if(!this.updateImagesForProducts.activated)
    {
      displayedColumns = displayedColumns.filter(x => x !== 'anh');
    }
    return displayedColumns;
  }

  //lấy thông tin điểm, nợ khách hàng
  onCustomerChange($event : any){
    console.log($event);
    if($event.id > 0){
      //điểm tích luỹ
      let bodyKH = {
        id: $event.id,
        maNhaThuoc: this.getMaNhaThuoc()
      }
      this.khachHangService.getPaymentScore(bodyKH).then(res => {
        if(res && res.statusCode == STATUS_API.SUCCESS){
          console.log(res.data);
          this.totalScore = res.data;
        }
      });
      //nợ khách hàng
      let bodyPX = {
        khachHangMaKhachHang: $event.id,
        nhaThuocMaNhaThuoc: this.getMaNhaThuoc(),
        ngayTinhNo: this.formData.get('ngayXuat')?.value
      }
      this.pxService.getTotalDebtAmountCustomer(bodyPX).then(res => {
        if(res && res.statusCode == STATUS_API.SUCCESS){
          this.totalDebtAmount = res.data;
          console.log(res.data);
        }
      });
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.key) {
      case "F9":
        this.onSave();
        break;
      case "down":
        break;
    }
  }
}
