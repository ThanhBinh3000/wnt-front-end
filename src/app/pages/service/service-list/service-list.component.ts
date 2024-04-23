import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { MatSort } from '@angular/material/sort';
import { DonViTinhService } from '../../../services/products/don-vi-tinh.service';
import { NhomThuocService } from '../../../services/products/nhom-thuoc.service';
import { ProductTypesService } from '../../../services/products/product-types-service';
import { ThuocService } from '../../../services/products/thuoc.service';
import { WarehouseLocationService } from '../../../services/products/warehouse-location-service';
import { ServiceAddEditDialogComponent } from '../service-add-edit-dialog/service-add-edit-dialog.component';
import { ServiceDetailDialogComponent } from '../service-detail-dialog/service-detail-dialog.component';
import { STATUS_API } from '../../../constants/message';
import { LOAI_SAN_PHAM } from '../../../constants/config';

@Component({
  selector: 'service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.css'],
})
export class ServiceListComponent extends BaseComponent implements OnInit {
  title: string = "Danh sách dịch vụ";
  displayedColumns = ['checkbox', '#', 'tenThuoc', 'tenNhomThuoc', 'giaNhap', 'giaBanLe', 'discount', 'scorable', 'action'];
  drugID: number = 0;

  listNhomDichVu : any[] = []

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service : ThuocService,
    private nhomThuocService : NhomThuocService,
    private donViTinhService : DonViTinhService,
    private warehouseLocationService : WarehouseLocationService,
    private productTypesService : ProductTypesService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      nhaThuocMaNhaThuoc: [],
      nhomThuocMaNhomThuoc: [],
      typeId : [],
      donViXuatLeMaDonViTinh: [],
      idWarehouseLocation : [],
      dataDelete : [false],
      typeService: [LOAI_SAN_PHAM.DICH_VU]
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
    this.searchPage();
  }
  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }
  @ViewChild(MatSort) sort?: MatSort;

  openAddEditDialog($event:any){
    const dialogRef = this.dialog.open(ServiceAddEditDialogComponent, {
      data: $event,
      width: '90%',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

  getDataFilter(){
    // Nhóm dịch vụ
    this.nhomThuocService.searchList({typeGroupProduct: LOAI_SAN_PHAM.DICH_VU}).then((res)=>{
      if(res?.statusCode == STATUS_API.SUCCESS){
        this.listNhomDichVu = res.data
      }
    });
  }

  openDetailDialog($event:any){
    const dialogRef = this.dialog.open(ServiceDetailDialogComponent, {
      data: $event,
      width: '600px',
    });
  }
}