import {Component, Injector, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {PickUpOrderService} from "../../../../services/order/pick-up-order.service";
import {BaseComponent} from "../../../../component/base/base.component";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {MESSAGE, STATUS_API} from "../../../../constants/message";
import {NhaCungCapService} from "../../../../services/categories/nha-cung-cap.service";
import {ThuocService} from "../../../../services/products/thuoc.service";
import {KhachHangService} from "../../../../services/customer/khach-hang.service";
import {DonViTinhService} from "../../../../services/products/don-vi-tinh.service";
import {PaymentTypeService} from "../../../../services/categories/payment-type.service";
import {InventoryService} from "../../../../services/inventory/inventory.service";

@Component({
  selector: 'app-handle-order',
  templateUrl: './handle-order.component.html',
  styleUrl: './handle-order.component.css'
})
export class HandleOrderComponent extends BaseComponent implements OnInit {
  title: string = "Xử lý đơn nhặt";
  listThuoc$ = new Observable<any[]>;
  listKhachHang$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  searchKhachHangTerm$ = new Subject<string>();
  orderFilterTypes = [
    { id: 0, label: '[Tất Cả]' },
    { id: 1, label: 'Đơn nhặt tạo mới' },
    { id: 102, label: 'Đơn đã cập nhật' },
    { id: 40, label: 'Đơn nhặt đã hoàn thành' }];
  constructor(
    private titleService: Title,
    injector: Injector,
    private _service : PickUpOrderService,
    private nhaCungCapService : NhaCungCapService,
    private thuocService : ThuocService,
    private khachHangService : KhachHangService,
    private donViTinhService : DonViTinhService,
    private inventoryService : InventoryService,
    private paymentTypeService : PaymentTypeService
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
      id : null,
      orderDate : [],
      orderNumber : [],
      createUserName : [],
      createdByUserId : [],
      totalAmount : [],
      cusName : [],
      cusId : [],
      orderStatusId : [],
      drugStoreId : [],
      description : [],
      paymentAmount : [],
      recordStatusId: [],
      archivedId : [],
      updated : [],
      updatedByUserId : [],
    })
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getId();
    this.getDataFilter();
    if(this.idUrl){
      const res = await this.service.getDetail(this.idUrl);
      if (res?.status == STATUS_API.SUCCESS) {
        const data = res.data;
        this.formData.patchValue(data);
        await this.getDataUpdate(data, data.chiTiets);
        await this.handleStatus();
      }
    }
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
    this.listKhachHang$ = this.searchKhachHangTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          debugger
          let bodyKhachHang = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            maNhaThuoc: this.getMaNhaThuoc(),
          };
          return from(this.khachHangService.searchPage(bodyKhachHang).then((res) => {
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

  async getDataUpdate(data: any, chiTiets : any[]) {
    this.formData.patchValue(data);
    this.dataTable = chiTiets;
    this.dataTable.filter(x => x.id > 0).forEach(x => {
      x.maThuocText = x.maThuoc;
      x.tenThuocText = x.tenThuoc;
      x.unitList = x.unitList;
      x.preRetailQuantity = x.quantity;
      x.isEditingItem = false
      this.getItemAmount(x);
    });
    // this.onCustomerChange({ id: data.khachHangMaKhachHang, tenKhachHang: data.khachHangMaKhachHangText });
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  async getItemAmount(item: any) {
    item.totalAmount = item.preRetailQuantity * item.price;
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
    // this.updateTotal();
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
          x.totalAmount = x.price + item.quantity;
          isExsit = true;
        }
      });
      if (!isExsit) {
        item.isEditingItem = false;
        item.itemOrder = this.dataTable.filter(x => !x.isEditingItem).length;
        this.dataTable.push(item);
      }
      this.dataTable[0] = { isEditingItem: true };
      ;
    }
  }

  async handleStatus(){
    if(this.formData.value.orderStatusId === 1){
      this.formData.value.orderStatusId = 102
    }
  }

  async onSave(complete?: boolean) {
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
      if (data && !complete) {
        this.router.navigate(['/management/order/list-order-pick-up']);
      }else if(data && complete){
        this._service.updateHandleOrder(body);
        this.router.navigate(['/management/note-management/delivery-note-screen']);
      }
    });
  }

}
