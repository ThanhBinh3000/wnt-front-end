import { Component, ElementRef, HostListener, Injector, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../../component/base/base.component';
import { LOAI_PHIEU } from '../../../../constants/config';
import { PhieuXuatService } from '../../../../services/inventory/phieu-xuat.service';
import { ThuocService } from '../../../../services/products/thuoc.service';
import { DatePipe } from '@angular/common';
import { PaymentTypeService } from '../../../../services/categories/payment-type.service';
import { DonThuocQuocGiaService } from '../../../../services/inventory/don-thuoc-quoc-gia.service';
import { MESSAGE, STATUS_API } from '../../../../constants/message';
import moment from 'moment';
import { DrugUpdateBatchDialogComponent } from '../../../drug/drug-update-batch-dialog/drug-update-batch-dialog.component';
import { NgSelectComponent } from '@ng-select/ng-select';
import { SETTING } from '../../../../constants/setting';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap } from 'rxjs';
import { AppDatePipe } from '../../../../component/pipe/app-date.pipe';

@Component({
  selector: 'delivery-note-es-screen',
  templateUrl: './delivery-note-es-screen.component.html',
  styleUrls: ['./delivery-note-es-screen.component.css'],
})
export class DeliveryNoteESScreenComponent extends BaseComponent implements OnInit {
  title: string = "Phiếu bán hàng với đơn thuốc điện tử";
  listPaymentType : any[] = [];
  listThuoc$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  expandLabel: string = "[-]";
  showMoreForm: boolean = true;
  totalScore: number = 0;
  totalDebtAmount: number = 0;
  debtValue: number = 0;
  debtLabel: string = 'Còn nợ';
  maNhaThuoc = this.authService.getNhaThuoc().maNhaThuoc;
  action: string = '';
  maThuocDons: any[] = [];

  notAllowDeliverOverQuantity = this.authService.getSettingByKey(SETTING.NOT_ALLOW_DELIVER_OVER_QUANTITY);
  moneyPerScoreRate = this.authService.getSettingByKey(SETTING.MONEY_PER_SCORE_RATE);
  deliveryNoteDiscountTotalByValue = this.authService.getSettingByKey(SETTING.DELIVERY_NOTE_DISCOUNT_TOTAL_BY_VALUE);
  allowChangeTotalAmountInDeliveryNote = this.authService.getSettingByKey(SETTING.ALLOW_CHANGE_TOTAL_AMOUNT_IN_DELIVERY_NOTE);

  displayedColumns = [
    '#',
    'maThuoc',
    'matHang',
    'donVi',
    'soLuong',
    'donGia',
    'loHan',
    'thanhTien'
  ];

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuXuatService,
    private thuocService: ThuocService,
    private paymentTypeService: PaymentTypeService,
    private datePipe: DatePipe,
    private donThuocQuocGiaService : DonThuocQuocGiaService,
    private appDatePipe: AppDatePipe,
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
      doseNumber: [1],
      createdByUserId: [0],
      invoiceNo: [],
      invoiceDate: [''],
      nationalFacilityCode: [''],
      discountWithRatio: [0],
      doctorComments: [''],
      locked: [],
      esampleNoteCode:[''],
      thongTinDon:[{}]
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.loadDataOpt();
    this.route.queryParams.subscribe(params => {
      this.action = params['action'];
    });
    this.getId();
    if (this.isUpdateView()) {
      let noteId = this.idUrl;
      let data = await this.detail(noteId);
      this.getDataUpdate(data , data.chiTiets);
      this.getThongTinDOnDienTu();
      console.log(data);
    }
    
    if(!this.isUpdateView()){
      let body = {
        maLoaiXuatNhap: LOAI_PHIEU.PHIEU_XUAT,
        id : null
      }
      this.service.init(body).then((res) => {
        if (res && res.data) {
             this.formData.controls['soPhieuXuat'].setValue(res.data.soPhieuXuat);
             this.formData.controls['ngayXuat'].setValue(res.data.ngayXuat);
        }
      });
    }
    this.dataTable.unshift({ isEditingItem: true });
    this.getDataFilter();
  }
  
  ngAfterViewInit() {
    this.focusSearchDrug();
  }

  expandForm() {
    this.showMoreForm = !this.showMoreForm;
    this.expandLabel = this.showMoreForm ? '[-]' : '[+]';
  };

  getThongTinDOnDienTu(){
    console.log(this.formData.get('esampleNoteCode')?.value.length);
    if(this.formData.get('esampleNoteCode')?.value.length < 14) return;
    let body = {
      code : this.formData.get('esampleNoteCode')?.value,
      storeCode: this.authService.getNhaThuoc().maNhaThuoc
    }
    this.donThuocQuocGiaService.searchList(body).then((res)=>{
      if (res?.status == STATUS_API.SUCCESS){
        this.formData.controls['thongTinDon'].setValue(res.data);
        if(res.data.ngaySinhBenhNhan){
           res.data.age = this.calculateAge(res.data.ngaySinhBenhNhan);
        }
        this.maThuocDons = res.data.thongTinDonThuoc.map((x: { maThuoc: any; })=>x.maThuoc);
      }
    });
  }

  calculateAge(dateString: string): number {
    // Chuyển chuỗi ngày sinh sang Date object
    const birthDate = new Date(dateString);
    const today = new Date();

    // Tính số năm chênh lệch giữa năm hiện tại và năm sinh
    let age = today.getFullYear() - birthDate.getFullYear();

    // Kiểm tra xem tháng/ngày của năm hiện tại có trùng hoặc vượt quá tháng/ngày của năm sinh không
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    // Điều chỉnh tuổi nếu sinh nhật của người đó chưa đến trong năm nay
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age;
  }

  getDataFilter() {
    this.listThuoc$ = this.searchThuocTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let bodyThuoc = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            nhaThuocMaNhaThuoc: this.maNhaThuoc,
            typeService: 0
          };
          return from(this.thuocService.searchPage(bodyThuoc).then((res) => {
            if (res?.status == STATUS_API.SUCCESS) {
              return res.data.content;
            }
          }));
        } else {
          return of([]);
        }
      }),
      catchError(() => of([]))
    );
  }

  async onDateChange(date: Date) {
    let noteDate = this.formData.get('noteDate')?.value;
    this.formData.controls['ngayXuat'].setValue(this.datePipe.transform(noteDate, 'dd/MM/yyyy HH:mm:ss') ?? '');
  }

  loadDataOpt() {
    this.paymentTypeService.searchList({}).then((res) => {
      this.listPaymentType = res?.data;
    });
  }

  isUpdateView(){
    return this.idUrl;
  }

  async getDataUpdate(data: any, chiTiets : any[]) {
    this.formData.patchValue(data);
    this.dataTable = chiTiets;
    this.dataTable.filter(x => x.id > 0).forEach(x => {
      x.donViTinhs = x.thuocs.listDonViTinhs;
      x.tonHT = x.thuocs.inventory ? x.thuocs.inventory.lastValue : 0;
      x.ton = x.tonHT;
      x.heSo = x.thuocs.heSo;
      x.donViXuatLeMaDonViTinh = x.thuocs.donViXuatLeMaDonViTinh;
      x.donViThuNguyenMaDonViTinh = x.thuocs.donViThuNguyenMaDonViTinh;
      x.maThuoc = x.maThuocText;
      x.tenThuoc = x.tenThuocText;
      x.giaBanLe = x.thuocs.giaBanLe;
      x.giaBanBuon = x.thuocs.giaBanBuon;
      if (x.donViTinhMaDonViTinh == x.donViThuNguyenMaDonViTinh) {
        x.tonHT = x.ton / x.heSo;
      }
      this.getItemAmount(x);
    });
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
  }

  updateTotal() {
    this.formData.controls['tongTien'].setValue(this.dataTable.filter(x => !x.isEditingItem)
      .reduce((acc, val) => acc += (val.tongTien), 0));
    let paymentScoreAmount = this.formData.get('paymentScoreAmount')?.value;
    let discount = this.formData.get('discount')?.value;
    let totalAmount = this.formData.get('tongTien')?.value;
    this.formData.controls['daTra'].setValue(totalAmount - discount - paymentScoreAmount);
  }

  getBatchNumberAndExpDate(item: any) {
    if (!item) return '';

    var retVal = '';
    if (item.expiredDate != null && item.expiredDate.length > 0) {
      retVal = moment(item.expiredDate).format('DD/MM/YYYY');
    }
    if (item.batchNumber != null && item.batchNumber.length > 0) {
      if (retVal.length == 0) {
        retVal = item.batchNumber;
      } else {
        retVal = retVal.concat("\n(", item.batchNumber, ")");
      }
    }

    return retVal;
  };

  openUpdateBatchDialog(drug: any) {
    if (drug.thuocThuocId > 0) {
      drug.isShowUsage = true;
      const dialogRef = this.dialog.open(DrugUpdateBatchDialogComponent, {
        data: drug,
        width: '600px',
      });
    }
    else {
      this.notification.error(MESSAGE.ERROR, 'Hãy chọn thuốc muốn cập nhật số lô/hạn dùng.');
    }
  }

  getBatchExpiryCss(item: any) {
    if ((item.expiredDate != null && item.expiredDate != '') || (item.batchNumber != null && item.batchNumber != '')) return 'btn-success';

    return 'btn-primary';
  }

  async onDrugChange(data: any) {
    if (data && data.id > 0) {
      this.thuocService.getDetail(data.id).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          var item = res.data;
          this.dataTable[0].isEditingItem = true;
          this.dataTable[0].thuocThuocId = item.id;
          this.dataTable[0].giaXuat = item.heSo > 1 ? item.giaBanLe * item.heSo : item.giaBanLe;
          this.dataTable[0].soLuong = 1;
          this.dataTable[0].donViTinhMaDonViTinh = item.heSo > 1 ? item.donViThuNguyenMaDonViTinh : item.donViXuatLeMaDonViTinh;
          this.dataTable[0].donViTinhs = item.listDonViTinhs;
          this.dataTable[0].vat = 0;
          this.dataTable[0].chietKhau = 0;
          this.dataTable[0].retailPrice = item.giaBanLe;
          this.dataTable[0].tonHT = item.inventory ? item.inventory.lastValue : 0;
          this.dataTable[0].ton = this.dataTable[0].tonHT;
          this.dataTable[0].isModified = false;
          this.dataTable[0].isProdRef = false;
          this.dataTable[0].id = 0;
          this.dataTable[0].heSo = item.heSo;
          this.dataTable[0].maThuocText = item.maThuoc;
          this.dataTable[0].tenThuocText = item.tenThuoc;
          this.dataTable[0].maThuoc = item.maThuoc;
          this.dataTable[0].tenThuoc = item.tenThuoc;
          this.dataTable[0].donViThuNguyenMaDonViTinh = item.donViThuNguyenMaDonViTinh;
          this.dataTable[0].donViXuatLeMaDonViTinh = item.donViXuatLeMaDonViTinh;
          this.dataTable[0].connectivityStatusId = 0;
          this.dataTable[0].referenceId = 0;
          this.dataTable[0].storeId = 0;
          this.dataTable[0].recordStatusId = 0;
          this.dataTable[0].giaBanBuon = item.giaBanBuon;
          this.dataTable[0].giaBanLe = item.giaBanLe;
          this.dataTable[0].refConnectivityCode = '';
          if (item.heSo > 1) {
            this.dataTable[0].tonHT = this.dataTable[0].ton / item.heSo;
          }
          this.getItemAmount(this.dataTable[0]);
          this.focusInputSoLuong();
        }
      });
    }
  }

  async onAddNew(item: any) {
    //kiểm tra hàng âm kho
    if (item.ton <= 0 && this.notAllowDeliverOverQuantity.activated) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.ALLOW_DELIVERY_OVER_QUANTITY);
      return;
    }
    //kiểm tra phiếu có thuốc chưa
    if (!item.thuocThuocId) {
      this.notification.error(MESSAGE.ERROR, "Hãy chọn thuốc thêm vào phiếu");
      return;
    }
    if (item.isEditingItem) {
      let isExsit = false;
      this.dataTable.filter(x => !x.isEditingItem).forEach(x => {
        if (x.thuocThuocId == item.thuocThuocId && x.donViTinhMaDonViTinh == item.donViTinhMaDonViTinh && x.giaXuat == item.giaXuat) {
          //cong so luong
          x.soLuong = x.soLuong + item.soLuong;
          isExsit = true;
        }
      });
      if (!isExsit) {
        item.isEditingItem = false;
        item.itemOrder = this.dataTable.filter(x => !x.isEditingItem).length;
        this.dataTable.push(item);
      }
      this.dataTable[0] = { isEditingItem: true };
      this.updateTotal();
      ;
    }
    setTimeout(() => this.focusSearchDrug(), 100);
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

  async onChangeUnit(item: any) {
    if (item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh) {
      item.giaXuat = item.giaBanLe;
      item.tonHT = item.ton;
    } else {
      item.giaXuat = item.giaBanLe * item.heSo;
      item.tonHT = item.ton / item.heSo;
    }
    await this.getItemAmount(item);
  }

  async onSave() {
    if(!this.formData.get('esampleNoteCode')?.value){
      this.notification.error(MESSAGE.ERROR, 'Vui lòng nhập mã đơn thuốc điện tử');
      return;
    }
    if (this.dataTable.filter(x => x.thuocThuocId > 0).length == 0) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
      return;
    }
    if(this.dataTable.filter(x=>x.refConnectivityCode).length <=0){
      this.notification.error(MESSAGE.ERROR, 'Bạn chưa chọn thuốc trong đơn');
      return;
    }
    let body = this.formData.value;
    if (this.dataTable.length == 1 && this.dataTable[0].isEditingItem) {
      await this.onAddNew(this.dataTable[0])
    }
    body.chiTiets = this.dataTable.filter(x => x.thuocThuocId > 0);
    this.save(body).then(data => {
      if (data) {
        if (this.isUpdateView()) {
          this.router.navigate(['/management/note-management/list'],
            { queryParams: { noteTypeId: LOAI_PHIEU.PHIEU_XUAT } });
        } else {
          this.router.navigate(['/management/note-management/delivery-note-es-screen', data.id],
             { queryParams: { action: 'view'} });
        }
      }
    });
  }

  async onPaymentScoreChange() {
    let paymentScore = this.formData.get('paymentScore')?.value;
    if (paymentScore > this.totalScore) {
      this.formData.controls['paymentScore'].setValue(0);
    }
    await this.onPaymentFull();
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

  onDiscountChange() {
    let totalAmount = this.formData.get('tongTien')?.value;
    let discount = this.formData.get('discount')?.value;
    let paymentScoreAmount = this.formData.get('paymentScoreAmount')?.value;
    discount = this.formData.get('discount')?.value;
    this.formData.controls['daTra'].setValue(totalAmount - discount - paymentScoreAmount);
  }

  onReturnListing() {
    this.router.navigate(['/management/note-management/list']);
  }

  editDeliveryNote(){
    this.router.navigate(['/management/note-management/delivery-note-es-screen', this.idUrl]);
  }

  onMaThuocDonChange(item: any){
    //kiểm tra mã thuốc đã chọn chưa
    if(this.dataTable.filter(x=>x.refConnectivityCode == item.refConnectivityCode && x.thuocThuocId != item.thuocThuocId).length > 0){
      item.refConnectivityCode = "";
      this.notification.error(MESSAGE.ERROR, 'Mã thuốc này đã được chọn vui lòng chọn thuốc mã khác');
      return;
    }
    //gán thong tin liên quan
    //lấy ra thông tin theo mã thuốc
    let data = this.formData.get('thongTinDon')?.value.thongTinDonThuoc.filter((x: { maThuoc: any; })=>x.maThuoc == item.refConnectivityCode);

    if(data){
      item.soLuong = data[0].soLuong;
      item.usage = data[0].cachDung;
    }
  }

  @ViewChild('selectDrug') selectDrug!: NgSelectComponent;
  async focusSearchDrug() {
    this.selectDrug?.focus();
  }

  @ViewChildren('inputSoLuong') inputSoLuongs!: QueryList<ElementRef>;

  async focusInputSoLuong() {
    if (this.inputSoLuongs.last) {
      this.inputSoLuongs.last.nativeElement.focus();
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