import {Component, Injector, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {BaseComponent} from "../../../component/base/base.component";
import {NhomThuocService} from "../../../services/products/nhom-thuoc.service";
import {MatDialog} from "@angular/material/dialog";
import {ThuocService} from "../../../services/products/thuoc.service";
import {RECORD_STATUS} from "../../../constants/config";
import {STATUS_API} from "../../../constants/message";
import {DonViTinhService} from "../../../services/products/don-vi-tinh.service";
import {WarehouseLocationService} from "../../../services/products/warehouse-location-service";
import {ProductTypesService} from "../../../services/products/product-types-service";

@Component({
  selector: 'drug-list',
  templateUrl: './drug-list.component.html',
  styleUrls: ['./drug-list.component.css'],
})
export class DrugListComponent extends BaseComponent implements OnInit {
  title: string = "Danh sách thuốc";
  drugID: number = 0;

  listNhomThuoc : any[] = []
  listDonViTinh : any[] = []
  listWarehouse : any[] = []
  listProductTypes : any[] = []

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service : ThuocService,
    private nhomThuocService : NhomThuocService,
    private donViTinhService : DonViTinhService,
    private warehouseLocationService : WarehouseLocationService,
    private productTypesService : ProductTypesService,
    private dialog: MatDialog
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      nhaThuocMaNhaThuoc: [],
      nhomThuocMaNhomThuoc: [],
      typeId : [],
      donViXuatLeMaDonViTinh: [],
      idWarehouseLocation : [],
      dataDelete : [false]
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
    this.searchPage();
  }

  goToPage($event:any){
    console.log($event.target.value,this.totalPages);
    let pageIndex = $event.target.value;
    if(pageIndex > 0 && pageIndex <= this.totalPages){
      this.changePageIndex(pageIndex)
    }
  }


  getDataFilter(){
    // Nhosm thuốc
    this.nhomThuocService.searchList({}).then((res)=>{
      if(res?.statusCode == STATUS_API.SUCCESS){
        this.listNhomThuoc = res.data
      }
    });
    // Đơn vị tính
    this.donViTinhService.searchList({}).then((res)=>{
      if(res?.statusCode == STATUS_API.SUCCESS){
        this.listDonViTinh = res.data
      }
    });
    // Vị trí kho
    this.warehouseLocationService.searchList({}).then((res)=>{
      if(res?.statusCode == STATUS_API.SUCCESS){
        this.listWarehouse = res.data
      }
    });
    // Vị trí kho
    this.productTypesService.searchList({}).then((res)=>{
      if(res?.statusCode == STATUS_API.SUCCESS){
        this.listProductTypes = res.data
      }
    });
  }

}
