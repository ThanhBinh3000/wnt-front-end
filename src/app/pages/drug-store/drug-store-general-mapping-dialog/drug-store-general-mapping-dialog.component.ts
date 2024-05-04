import {AfterViewInit, Component, Inject, Injector, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {BaseComponent} from "../../../component/base/base.component";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";
import {OrderStoreMappingService} from "../../../services/categories/order-store-mapping.service";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import { ORDER_STORE_MAPPING } from '../../../constants/config';

@Component({
  selector: 'drug-store-general-mapping-dialog',
  templateUrl: './drug-store-general-mapping-dialog.component.html',
  styleUrl: './drug-store-general-mapping-dialog.component.css'
})
export class DrugStoreGeneralMappingDialogComponent extends BaseComponent implements OnInit, AfterViewInit {
  displayedColumns = ['#', 'maNhaThuoc', 'diaChi', 'dienThoai', 'nguoiDaiDien', 'active', 'default'];

  constructor(
    injector: Injector,
    public _service: NhaThuocsService,
    private orderStoreMappingService: OrderStoreMappingService,
    public dialogRef: MatDialogRef<DrugStoreGeneralMappingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public store: any
  ) {
    super(injector, _service);
    this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });
    this.formData = this.fb.group({
      textSearch: [''],
      currentStoreCode: [this.store.maNhaThuoc]
    });
  }

  async ngOnInit() {
    await this.searchPage();
  }

  @ViewChild(MatSort) sort?: MatSort;
  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  override async searchPage() {
    let body = this.formData.value;
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this._service.searchPageNhaThuocTong(body);
    if (res?.status == STATUS_API.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      this.totalPages = data.totalPages;
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
    }
  }

   async updateOrderStoreMapping(item: any, updateTypeId: any, updateValue: any) {
    let body = {
      storeCode: this.store.maNhaThuoc,
      targetStoreCode: item.maNhaThuoc,
      updateTypeId: updateTypeId,
      updateValue: updateValue
    }
    if (updateTypeId == ORDER_STORE_MAPPING.SET_DEFAULT) {
      body.updateValue = true;
    }
    let res = await this.orderStoreMappingService.create(body);
    if (res && res.status == STATUS_API.SUCCESS) {
      let msg = updateValue ? "Kích hoạt nhà tổng đặt hàng thành công." : "Tắt kích hoạt nhà tổng đặt hàng thành công.";
      if (updateTypeId == ORDER_STORE_MAPPING.SET_DEFAULT) {
        msg = "Thiết lập nhà tổng mặc định thành công";
        item.orderingActivated = true;
      }
      this.notification.success(MESSAGE.SUCCESS, msg);
      return res.data;
    }
  };

  closeModal() {
    this.dialogRef.close();
  }

  protected readonly ORDER_STORE_MAPPING = ORDER_STORE_MAPPING;
}
