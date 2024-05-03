import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {BaseComponent} from "../../../component/base/base.component";
import {NhomThuocService} from "../../../services/products/nhom-thuoc.service";
import {ThuocService} from "../../../services/products/thuoc.service";
import {STATUS_API} from "../../../constants/message";
import {DonViTinhService} from "../../../services/products/don-vi-tinh.service";
import {WarehouseLocationService} from "../../../services/products/warehouse-location-service";
import {ProductTypesService} from "../../../services/products/product-types-service";
import {DrugAddEditDialogComponent} from "../drug-add-edit-dialog/drug-add-edit-dialog.component";
import { DrugDetailDialogComponent } from '../drug-detail-dialog/drug-detail-dialog.component';
import { MatSort } from '@angular/material/sort';
import { LOAI_SAN_PHAM } from '../../../constants/config';
import {UploadImageComponent} from "../../../component/upload-image/upload-image.component";
import {UploadFileService} from "../../../services/file/upload-file.service";

@Component({
  selector: 'drug-list',
  templateUrl: './drug-list.component.html',
  styleUrls: ['./drug-list.component.css'],
})
export class DrugListComponent extends BaseComponent implements OnInit {
  title: string = "Danh sách thuốc";
  displayedColumns = ['checkbox', '#', 'upload', 'tenThuoc', 'tenNhomThuoc', 'donVi', 'gia', 'discount', 'gioiHan', 'tonKho', 'tuKho', 'action'];
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
    private uploadFileService : UploadFileService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      tenThuoc: [],
      nhaThuocMaNhaThuoc: [],
      nhomThuocMaNhomThuoc: [],
      typeId : [],
      donViXuatLeMaDonViTinh: [],
      idWarehouseLocation : [],
      dataDelete : [false],
      typeService: [LOAI_SAN_PHAM.THUOC]
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
    await this.searchPage();
  }
  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }
  @ViewChild(MatSort) sort?: MatSort;

  goToPage($event:any){
    let pageIndex = $event.target.value;
    if(pageIndex > 0 && pageIndex <= this.totalPages){
      this.changePageIndex(pageIndex)
    }
  }

  onUploadImageDialog(data){
    const dialogRef = this.dialog.open(UploadImageComponent, {
      width: '50%',
      height : '300px'
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        let body = {
          dataId : data.id,
          dataType : 'thuocs'
        }
        this._service.uploadImage(result[0],body).then((res)=>{
          if(res){
            this.searchPage();
          }
        })
      }
    });
  }

  getDataFilter(){
    // Nhóm thuốc
    this.nhomThuocService.searchList({typeGroupProduct: LOAI_SAN_PHAM.THUOC}).then((res)=>{
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
    // Loại thuốc
    this.productTypesService.searchList({}).then((res)=>{
      if(res?.statusCode == STATUS_API.SUCCESS){
        this.listProductTypes = res.data
      }
    });
  }

  openAddEditDialog($event:any){
    console.log($event);
    const dialogRef = this.dialog.open(DrugAddEditDialogComponent, {
      data: $event,
      width: '90%',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

  openDetailDialog(drugId:any){
    const dialogRef = this.dialog.open(DrugDetailDialogComponent, {
      data: drugId,
      width: '600px',
    });
  }

  async getUrl(path){
    if(path){
      console.log(path);
      console.log(this.uploadFileService.getUrl(path));
      // this.uploadFileService.getUrl(path).subscribe((then)=>{
      //   console.log(then);
      //   return then;
      // });
      return null;
    }else{
      return null;
    }
  }

}
