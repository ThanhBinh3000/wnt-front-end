import {Component, Injector, Input, OnInit} from '@angular/core';
import {STATUS_API} from "../../../constants/message";
import {BaseComponent} from "../../../component/base/base.component";
import {Title} from "@angular/platform-browser";
import {ThuocService} from "../../../services/products/thuoc.service";
import {NhomThuocService} from "../../../services/products/nhom-thuoc.service";
import {DonViTinhService} from "../../../services/products/don-vi-tinh.service";
import {WarehouseLocationService} from "../../../services/products/warehouse-location-service";
import {ProductTypesService} from "../../../services/products/product-types-service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'drug-add-edit-dialog',
  templateUrl: './drug-add-edit-dialog.component.html',
  styleUrls: ['./drug-add-edit-dialog.component.css'],
})
export class DrugAddEditDialogComponent extends BaseComponent implements OnInit {
  @Input() drugID: number = 0;
  @Input() location: string = 'body';
  checkTab: string = 'main-information';
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
    public dialogRef: MatDialogRef<DrugAddEditDialogComponent>,
    // private dialog: MatDialog
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      idWarehouseLocation : [],
      maThuoc : [],
      tenThuoc : [],
      nhaThuocMaNhaThuoc: [],
      nhomThuocMaNhomThuoc: [],
      typeId : [],
      donViXuatLeMaDonViTinh: [],
      dataDelete : [false]
    });
  }

  ngOnInit() {
    this.getDataFilter();
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

  createUpdate(){
    let body = this.formData.value;
    console.log(body);
    this.save(body);
  }

  closeModal() {
    this.dialogRef.close();
  }

}
