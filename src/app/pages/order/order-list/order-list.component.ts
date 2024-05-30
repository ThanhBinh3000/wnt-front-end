import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {BaseComponent} from "../../../component/base/base.component";
import {OrdersService} from "../../../services/order/order.service";
import {NhaCungCapService} from "../../../services/categories/nha-cung-cap.service";
import {ThuocService} from "../../../services/products/thuoc.service";
import {DonViTinhService} from "../../../services/products/don-vi-tinh.service";
import {PaymentTypeService} from "../../../services/categories/payment-type.service";
import {STATUS_API} from "../../../constants/message";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {LOAI_SAN_PHAM} from "../../../constants/config";
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent extends BaseComponent implements OnInit {
  title: string = "Tra cứu đơn đặt hàng";
  sumAmount: any;
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
  @ViewChild(MatSort) sort?: MatSort;
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
      nameWarehouse : [],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPage();
    await this.sumTotalAmount();
  }

  async sumTotalAmount(){
    this.sumAmount = this.dataTable.reduce((acc, val) => acc += (val.paymentAmount), 0);
    return this.sumAmount;
  }

}
