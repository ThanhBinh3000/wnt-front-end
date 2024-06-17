import { Component, EventEmitter, Injector, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { ConnectivityDeliveryItemTableComponent } from './connectivity-delivery-item-table/connectivity-delivery-item-table.component';
import { ConnectivityReceiptItemTableComponent } from './connectivity-receipt-item-table/connectivity-receipt-item-table.component';
import { PhieuXuatService } from '../../../services/inventory/phieu-xuat.service';
import { PhieuNhapService } from '../../../services/inventory/phieu-nhap.service';
import { ConnectivityDrugItemTableComponent } from './connectivity-drug-item-table/connectivity-drug-item-table.component';

@Component({
  selector: 'connectivity-list',
  templateUrl: './connectivity-list.component.html',
  styleUrls: ['./connectivity-list.component.css'],
})
export class ConnectivityListComponent extends BaseComponent implements OnInit {

  title = "Quản lý liên thông";
  @ViewChild(ConnectivityDeliveryItemTableComponent) connectivityDeliveryItemTableComponent?: ConnectivityDeliveryItemTableComponent;
  @ViewChild(ConnectivityReceiptItemTableComponent) connectivityReceiptItemTableComponent?: ConnectivityReceiptItemTableComponent;
  @ViewChild(ConnectivityDrugItemTableComponent) connectivityDrugItemTableComponent?: ConnectivityDrugItemTableComponent;
  formDataChange = new EventEmitter();
  checkTab: string = 'receipt';

  trangThaiLT = [
    {id: "", value: "Tất cả"},
    {id: 0, value: "Chưa LT"},
    {id: 2, value: "Đã LT"}];
    
  constructor(
    injector: Injector,
    private titleService: Title,
    private phieuXuatService: PhieuXuatService,
    private phieuNhapService: PhieuNhapService,
  ) {
    super(injector, phieuNhapService);
    this.formData = this.fb.group({
      dataDelete: [false],
      nhaThuocMaNhaThuoc: this.authService.getNhaThuoc().maNhaThuoc,
      fromDateNgayXuat:[],
      toDateNgayXuat:[],
      fromDateNgayNhap:[],
      toDateNgayNhap:[],
      soPhieu: [],
      connectivityStatusID: [""]
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);

  }

  async ngAfterViewInit() {
    this.searchPage();
  }
  override async searchPage() {
    this.formDataChange.emit(this.formData.value);
    await this.connectivityDeliveryItemTableComponent?.searchPage();
    await this.connectivityReceiptItemTableComponent?.searchPage();
    await this.connectivityDrugItemTableComponent?.searchPage();
  }
}