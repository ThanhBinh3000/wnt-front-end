import {Component, ElementRef, Injector, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {LOAI_PHIEU} from "../../../constants/config";
import {BaseComponent} from "../../../component/base/base.component";
import {PhieuNhapService} from "../../../services/thuchi/phieu-nhap.service";
import {NhaCungCapService} from "../../../services/categories/nha-cung-cap.service";
import {ThuocService} from "../../../services/products/thuoc.service";
import {DonViTinhService} from "../../../services/products/don-vi-tinh.service";
import {PaymentTypeService} from "../../../services/categories/payment-type.service";
import {NgSelectComponent} from "@ng-select/ng-select";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {SETTING} from "../../../constants/setting";
import {OrdersService} from "../../../services/order/order.service";
import {Validators} from "@angular/forms";

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrl: './create-order.component.css'
})
export class CreateOrderComponent extends BaseComponent implements OnInit {
  title: string = "Đơn đặt hàng";
  isView: boolean = false;
  @ViewChild('selectDrug') selectDrug!: NgSelectComponent;
  listThuoc$ = new Observable<any[]>;
  listKhachHang$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  searchKhachHangTerm$ = new Subject<string>();
  @ViewChildren('inputSoLuong') inputSoLuongs!: QueryList<ElementRef>;
  drugDefault: any = {};
  copyId = 0;
  listOrderStatusId = [
    {
      id: 1,
      value: "Đơn tạo mới"
    }
  ]
  notAllowDeliverOverQuantity = this.authService.getSettingByKey(SETTING.NOT_ALLOW_DELIVER_OVER_QUANTITY);
  allowChangeTotalAmountInDeliveryNote = this.authService.getSettingByKey(SETTING.ALLOW_CHANGE_TOTAL_AMOUNT_IN_DELIVERY_NOTE);
  updateImagesForProducts = this.authService.getSettingByKey(SETTING.UPDATE_IMAGES_FOR_PRODUCTS);
  moneyPerScoreRate = this.authService.getSettingByKey(SETTING.MONEY_PER_SCORE_RATE);
  enableChangeStaffDeliveryNote = this.authService.getSettingByKey(SETTING.ENABLE_CHANGE_STAFF_DELIVERY_NOTE);
  enableElectronicInvoice = this.authService.getSettingByKey(SETTING.ENABLE_ELECTRONIC_INVOICE);
  deliveryNoteDiscountTotalByValue = this.authService.getSettingByKey(SETTING.DELIVERY_NOTE_DISCOUNT_TOTAL_BY_VALUE);
  constructor(
    private titleService: Title,
    injector: Injector,
    private _service : OrdersService,
    private nhaCungCapService : NhaCungCapService,
    private thuocService : ThuocService,
    private donViTinhService : DonViTinhService,
    private paymentTypeService : PaymentTypeService
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
      id : null,
      orderDate : [],
      orderNumber : [],
      invoiceId: 0,
      secureCode: [],
      totalAmount: 0,
      totalPriceWithoutPromotion: 0,
      vat: 0,
      promotionId: 0,
      paymentMethodId: 0,
      isPayed: [],
      createdDate: null,
      completedDate: [],
      payedDate: [],
      userId: 0,
      drugStoreId: 0,
      supplierDrugStoreId: 0,
      orderStatusId: [1, Validators.required],
      paymentAmount: 0,
      isDebt: [],
      supplierDescription: [],
      description: [],
      noteId: 0,
      shoppingCart: true,
      deliveryNoteId: 0,
      receiptNoteId: 0,
      targetCombinedOrderId: 0,
      sourceCombinedOrderIds: 0,
      storeId: 0,
      supplierStoreId: 0,
      recordStatusId: 0,
      noteTypeId: 0,
      customerId: 0,
      customerAddress: [],
      customerFullName: [],
      customerPhone: [],
      customerCode: [],
      orderId: 0,
      drugId: 0,
      unitId: 0,
      retailUnitId: 0,
      quantity: [],
      price: [],
      factors: [],
      realQuantity: [],
      itemOrder: [],
      discount: 0,
      created: null,
      createdByStoreId: 0,
      supplierStoreCode: [],
      inPrice: [],
      isPickUpGoods: [],
      groupOfGoods: [],
    })
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getId();
    debugger
    // if (this.isUpdateView() || this.copyId > 0) {
    //   let noteId = !this.idUrl ? this.copyId : this.idUrl;
    //   let data = await this.getDetail(noteId);
    //   await this.getDataUpdate(data, data.chiTiets);
    // }
    this.route.queryParamMap.subscribe(params => {
      this.isView = params.get('isView') === 'true';
    });
    if(this.idUrl){
      const data = await this.getDetail(this.idUrl);
      this.formData.patchValue(data);
      await this.getDataUpdate(data, data.chiTiets);
      if(!this.isView){
        this.dataTable.unshift({ isEditingItem: true });
      }
      // this.dataTable = data.chiTiets;
    }else{
      let body = {
        loaiXuatNhapMaLoaiXuatNhap : LOAI_PHIEU.PHIEU_NHAP,
        id : null
      }
      this.service.init(body).then((res)=>{
        if(res && res.data){
          const data = res.data;
          this.formData.patchValue({
            orderDate : data.orderDate,
            orderNumber : data.orderNumber,
            orderStatusId: 1,
            createdDate : data.orderDate,
            tenNguoiTao : this.authService.getUser().fullName,
          })
        }
      });
      this.dataTable.unshift({ isEditingItem: true });
    }
    this.getDataFilter();
  }

  async getDetail(id: number) {
    if (id) {
      let res = await this.service.getDetail(id);
      if (res?.status == STATUS_API.SUCCESS) {
        const data = res.data;
        return data;
      } else {
        return null;
      }
    }
  }

  isUpdateView() {
    return this.idUrl;
  }

  getDataFilter() {
    // let body = { dataDelete: false, maNhaThuoc: this.getMaNhaThuoc() };
    // this.bacSiesService.searchList(body).then((res) => {
    //   if (res?.status == STATUS_API.SUCCESS) {
    //     this.listBacSys = res.data;
    //   }
    // });
    //
    // this.userProfileService.searchListStaffManagement(body).then((res) => {
    //   if (res?.status == STATUS_API.SUCCESS) {
    //     this.listNhanViens = res.data;
    //   }
    // });

    this.listThuoc$ = this.searchThuocTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let bodyThuoc = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            nhaThuocMaNhaThuoc: this.getMaNhaThuoc(),
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
    // Search khách hàng
    // this.listKhachHang$ = this.searchKhachHangTerm$.pipe(
    //   debounceTime(500),
    //   distinctUntilChanged(),
    //   switchMap((term: string) => {
    //     if (term.length >= 2) {
    //       let bodyKhachHang = {
    //         textSearch: term,
    //         paggingReq: { limit: 25, page: 0 },
    //         dataDelete: false,
    //         maNhaThuoc: this.getMaNhaThuoc(),
    //       };
    //       return from(this.khachHangService.searchPage(bodyKhachHang).then((res) => {
    //         if (res?.status == STATUS_API.SUCCESS) {
    //           return res.data.content;
    //         }
    //       }));
    //     } else {
    //       return of([]);
    //     }
    //   }),
    //   catchError(() => of([]))
    // );
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  async onDrugChange(data: any) {
    if (data && data.id > 0) {
      this.thuocService.getDetail(data.id).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          var item = res.data;
          this.dataTable[0].isEditingItem = true;
          this.dataTable[0].drugId = item.id;
          this.dataTable[0].quantity = 1;
          this.dataTable[0].price = item.giaBanLe;
          this.dataTable[0].unitId = 0;
          this.dataTable[0].supplierStoreCode = item.maNhaCungCap;
          this.dataTable[0].inPrice = item.giaBanLe * this.dataTable[0].quantity;
          this.dataTable[0].maThuoc = item.maThuoc;
          this.dataTable[0].tenThuoc = item.tenThuoc;
          this.dataTable[0].giaBanLe = item.giaBanLe;
          this.dataTable[0].maThuocText = item.maThuoc;
          this.dataTable[0].tenThuocText = item.tenThuoc;
          this.dataTable[0].groupOfGoods = item.tenNhomThuoc;
          this.dataTable[0].discount = item.discount;
          this.formData.value.discount = item.discount;
          this.focusInputSoLuong();
        }
      });
    }
  }

  async focusInputSoLuong() {
    if (this.inputSoLuongs.last) {
      this.inputSoLuongs.last.nativeElement.focus();
    }
  }

  async onAddNew(item: any) {
    //kiểm tra hàng âm kho
    // if (item.ton <= 0 && this.notAllowDeliverOverQuantity.activated) {
    //   this.notification.error(MESSAGE.ERROR, MESSAGE.ALLOW_DELIVERY_OVER_QUANTITY);
    //   return;
    // }
    //kiểm tra phiếu có thuốc chưa
    if (!item.drugId) {
      this.notification.error(MESSAGE.ERROR, "Hãy chọn thuốc thêm vào phiếu");
      return;
    }
    if (item.isEditingItem) {
      let isExsit = false;
      this.dataTable.filter(x => !x.isEditingItem).forEach(x => {
        if (x.drugId == item.drugId) {
          x.inPrice = x.price + item.quantity;
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

  updateTotal() {
    // this.formData.controls['tongTien'].setValue(this.dataTable.filter(x => !x.isEditingItem)
    //   .reduce((acc, val) => acc += (val.tongTien), 0));
    // let paymentScoreAmount = this.formData.get('paymentScoreAmount')?.value;
    // let discount = this.formData.get('discount')?.value;
    // let totalAmount = this.formData.get('tongTien')?.value;
    // this.formData.controls['daTra'].setValue(totalAmount - discount - paymentScoreAmount);
  }

  async focusSearchDrug() {
    this.selectDrug?.focus();
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

  getDisplayedColumns() {
    let displayedColumns = [
      '#',
      'stt',
      'anh',
      'matHang',
      'soLuong',
      'donGia',
      'donVi',
      'nhomHang',
      'nhaCc',
      'thanhTien',
    ];
    if (!this.updateImagesForProducts.activated) {
      displayedColumns = displayedColumns.filter(x => x !== 'anh');
    }
    return displayedColumns;
  }

  async getItemAmount(item: any) {
    // let discount = (item.giaXuat > 0.05 ? (item.chietKhau / item.giaXuat) : 0) * 100;
    // discount = discount < 0.5 ? 0 : discount;
    // let vat = item.vat < 0.5 ? 0 : item.vat;
    // let price = item.giaXuat * (1 - (discount / 100)) * (1 + (vat / 100));
    item.inPrice = item.quantity * item.price;
    // item.retailQuantity = item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh ? item.soLuong : item.soLuong * item.heSo;
    // item.retailPrice = item.donViTinhMaDonViTinh == item.donViXuatLeMaDonViTinh ? item.giaXuat : item.giaXuat / item.heSo;
    this.updateTotal();
  }

  getItemTotalAmount(item: any) {
    let quantity = item.quantity; // self.getQuantity(item);
    let amount = item.price * quantity;
    if (item.discount > 0.5) {
      amount -= quantity * (item.price * item.discount / 100);
    }
    return amount;
  };

  getOrderTotalAmount() {
    let amount = 0.0;
    this.dataTable.forEach(item =>{
      if (item.drugId > 0) {
        amount += this.getItemTotalAmount(item);
      }
    })
    this.formData.value.paymentAmount = amount;
    return amount;
  };

  getOrderDiscountAmount() {
    let amount = this.getOrderTotalAmount();
    // let discountAmount = math.round(amount * this.formData.value.discount / 100, 0);
    let discountAmount = amount * this.formData.value.discount / 100;

    return discountAmount;
  };

  async getDataUpdate(data: any, chiTiets : any[]) {
    this.formData.patchValue(data);
    this.dataTable = chiTiets;
    this.dataTable.filter(x => x.id > 0).forEach(x => {
      x.maThuocText = x.maThuoc;
      x.tenThuocText = x.tenThuoc;
      x.isEditingItem = false
      this.getItemAmount(x);
    });
    // this.onCustomerChange({ id: data.khachHangMaKhachHang, tenKhachHang: data.khachHangMaKhachHangText });
  }

  async onSave() {
    if (this.dataTable.filter(x => x.drugId > 0).length == 0) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
      return;
    }
    let body = this.formData.value;
    if (this.dataTable.length == 1 && this.dataTable[0].isEditingItem) {
      await this.onAddNew(this.dataTable[0])
    }
    body.chiTiets = this.dataTable.filter(x => x.drugId > 0);
    this.save(body).then(data => {
      if (data) {
        // if (this.isUpdateView()) {
          this.router.navigate(['/management/order/order-list']);
        // } else {
        //   this.router.navigate(['/management/order/delivery-note-detail', data.id],
        //     { queryParams: { isContinue: true } });
        // }
      }
    });
  }
}
