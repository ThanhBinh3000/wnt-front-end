import {Component, Injector, Input, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {BaseComponent} from "../../../component/base/base.component";
import {OrdersService} from "../../../services/order/order.service";
import {NhaCungCapService} from "../../../services/categories/nha-cung-cap.service";
import {ThuocService} from "../../../services/products/thuoc.service";
import {DonViTinhService} from "../../../services/products/don-vi-tinh.service";
import {PaymentTypeService} from "../../../services/categories/payment-type.service";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {LOAI_SAN_PHAM} from "../../../constants/config";
import { MatSort } from '@angular/material/sort';
import {OrderStatusService} from "../../../services/order/order-status.service";
import {NgSelectComponent} from "@ng-select/ng-select";
import {BacSiesService} from "../../../services/medical/bac-sies.service";
import {UserProfileService} from "../../../services/system/user-profile.service";

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent extends BaseComponent implements OnInit {
  title: string = "Tra cứu đơn đặt hàng";
  @ViewChild('selectDrug') selectDrug!: NgSelectComponent;
  listThuoc$ = new Observable<any[]>;
  listKhachHang$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  searchKhachHangTerm$ = new Subject<string>();
  sumAmount: any;
  listOrderStatus: any[] = [];
  listBacSys : any[] = [];
  sumDiscount: any;
  listNhanViens: any[] = [];
  soLuongThuoc: any;
  displayedColumns = [
    'stt',
    'maSo',
    'created',
    'nhanVien',
    'nhaThuoc',
    'slThuoc',
    'tongTien',
    'tienCk',
    'trangThai',
    'khachHang',
    'action',
  ];
  searchTypes = [
    { name: "Mã sản phẩm", value: 0 },
    { name: "Mã số đơn", value: 1 },
    { name: "Nhân viên", value: 2 },
    { name: "Diễn giải", value: 3 },
  ]


  @ViewChild(MatSort) sort?: MatSort;
  constructor(
    private titleService: Title,
    injector: Injector,
    private _service : OrdersService,
    private nhaCungCapService : NhaCungCapService,
    private orderStatusService : OrderStatusService,
    private bacSiesService: BacSiesService,
    private thuocService : ThuocService,
    private userProfileService: UserProfileService,
    private donViTinhService : DonViTinhService,
    private paymentTypeService : PaymentTypeService
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
      orderStatusId : null,
      searchType : 0,
      drugId : [],
      orderNumber : [],
      customerId : [],
      description : [],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPage();
    await this.sumTotalAmount();
    await this.getOrderStatusList();
    await this.getDataFilter();
  }

  async sumTotalAmount(){
    this.sumAmount = this.dataTable.reduce((acc, val) => acc += (val.paymentAmount), 0);
    return this.sumAmount;
  }

  slThuoc(data: any){
    return data.chiTiets.reduce((acc: number, val: any) => acc += (val.quantity), 0);
  }

  discount(data: any){
    return data.chiTiets.reduce((acc: number, val: any) => acc += (val.quantity), 0);
  }

  getOrderDiscountAmount(data: any) {
    let amount = this.slThuoc(data);
    let discountAmount = amount * data.discount / 100;
    return discountAmount;
  };

  async sumDiscountAmount(){
    this.sumDiscount = this.dataTable.reduce((acc, val) => acc += (val.paymentAmount), 0);
    return this.sumAmount;
  }

  async sendOrder(code: string, item: any) {
    let body = item;
    body.orderStatusId = 20 //Seller_New
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: `Bạn thực sự muốn gửi đơn có mã '${code}' tới nhà cung cấp?`,
      okText: 'Đồng ý',
      cancelText: 'Không',
      okDanger: true,
      width: 310,
      onOk: async () => {
        this._service.sendOrder(item).then(async (res) => {
          if (res && res.data) {
            this.notification.success(MESSAGE.SUCCESS, `Đơn hàng có mã số '${code}' đã được gửi đến nhà cung cấp.`);
            await this.searchPage();
          }
        });
      },
    });
  }

  async getOrderStatusList(){
    let body = this.formData.value;
    await this.orderStatusService.searchList(body).then(async (res) =>{
      if (res && res.data) {
        let all = {
          id: null,
          buyerDisplayName: '--Tất cả--'
        }
        this.listOrderStatus = res.data
        this.listOrderStatus.push(all);
        console.log(this.listOrderStatus)
      }
    })
  }

  async onDrugChange(data: any) {
    if (data && data.id > 0) {
      this.thuocService.getDetail(data.id).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          var item = res.data;
          this.dataTable[0].maThuoc = item.maThuoc;
          this.dataTable[0].tenThuoc = item.tenThuoc;
          this.formData.value.drugId = item.id;
        }
      });
    }
  }

  getDataFilter() {
    let body = { dataDelete: false, maNhaThuoc: this.getMaNhaThuoc() };
    this.bacSiesService.searchList(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listBacSys = res.data;
      }
    });

    this.userProfileService.searchListStaffManagement(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhanViens = res.data;
      }
    });

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

  async handleSearchType(){
    this.formData.patchValue({
      drugId: null,
      orderNumber: null,
      description: null,
      customerId: null
    })
    console.log(this.formData, 0)
  }
}
