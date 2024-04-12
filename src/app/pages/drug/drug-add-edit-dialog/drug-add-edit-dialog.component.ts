import {Component, Inject, Injector, Input, OnInit} from '@angular/core';
import {STATUS_API} from "../../../constants/message";
import {BaseComponent} from "../../../component/base/base.component";
import {Title} from "@angular/platform-browser";
import {ThuocService} from "../../../services/products/thuoc.service";
import {NhomThuocService} from "../../../services/products/nhom-thuoc.service";
import {DonViTinhService} from "../../../services/products/don-vi-tinh.service";
import {WarehouseLocationService} from "../../../services/products/warehouse-location-service";
import {ProductTypesService} from "../../../services/products/product-types-service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {
  DrugGroupAddEditDialogComponent
} from "../../drug-group/drug-group-add-edit-dialog/drug-group-add-edit-dialog.component";

@Component({
  selector: 'drug-add-edit-dialog',
  templateUrl: './drug-add-edit-dialog.component.html',
  styleUrls: ['./drug-add-edit-dialog.component.css'],
})
export class DrugAddEditDialogComponent extends BaseComponent implements OnInit {

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
    @Inject(MAT_DIALOG_DATA) public drugId : any
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      idWarehouseLocation : [],
      nhomThuocMaNhomThuoc: [],
      donViXuatLeMaDonViTinh: [],
      maThuoc : [],
      giaNhap : [0],
      tenThuoc : [],
      giaBanLe : [0],
      thongTin : [],
      donViThuNguyenMaDonViTinh : [],
      barCode : [],
      heSo : [0],
      hangTuVan : [],
      giaBanBuon : [0],
      hanDung : [],
      soDuDauKy : [0],
      giaDauKy : [0],
      discount : [0],
      discountByRevenue : [],
      presentation : [false],
      scorable : [false],
      moneyToOneScoreRate : [0],
      hamLuong : [0],
      quyCachDongGoi : [],
      nhaSanXuat : [],
      xuatXu : [],
      advantages : [],
      userObject : [],
      pharmacokinetics : [],
      userManual : [],
      storageConditions : [],
      storageLocation : [],
      chiDinh : [],
      chongChiDinh : [],
      registeredNo : [],
      noted : [],
      promotionalDiscounts : [],
      enablePromotionalDiscounts : [],
      descriptionOnWebsite : [],
      gioiHan : [0],
      nhaThuocMaNhaThuoc: [],
      productTypeId : [],
    });
  }

  async ngOnInit() {
    this.getDataFilter();
    console.log(this.drugId)
    if(this.drugId){
      const data = await this.detail(this.drugId);
      this.formData.patchValue(data);
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

  async createUpdate(){
    let body = this.formData.value;
    console.log(body);
    let res = await this.save(body);
    if(res){
        this.dialogRef.close(res);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  openAddEditNhomThuocDialog(){
    const dialogRef = this.dialog.open(DrugGroupAddEditDialogComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.nhomThuocService.searchList({}).then((res)=>{
          if(res?.statusCode == STATUS_API.SUCCESS){
            this.listNhomThuoc = res.data
          }
        });
      }
    });
  }

}
