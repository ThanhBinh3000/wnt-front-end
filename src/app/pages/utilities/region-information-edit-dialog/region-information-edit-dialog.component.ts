import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from '../../../component/base/base.component';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { UtilitiesService } from '../../../services/categories/utilities.service';
import { MESSAGE, STATUS_API } from '../../../constants/message';

@Component({
  selector: 'app-region-information-edit-dialog',
  templateUrl: './region-information-edit-dialog.component.html',
  styleUrl: './region-information-edit-dialog.component.css'
})
export class RegionInformationEditDialogComponent extends BaseComponent implements OnInit {

  listTinhThanh : any[] = [];
  listQuanHuyen : any[] = [];
  listPhuongXa : any[] = [];

  constructor(
    injector: Injector,
    @Inject(MAT_DIALOG_DATA)  public object: any,
    private _service: KhachHangService,
    private utilitiesService : UtilitiesService,
    public dialogRef: MatDialogRef<RegionInformationEditDialogComponent>,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      cityId : object.cityId,
      regionId : object.regionId,
      wardId : object.wardId,
      id : object.id
    });
  }

  async ngOnInit() {
    this.getRegionData();
    if(this.object.regionId > 0){
      this.getCityData(this.object.regionId);
    }
    if(this.object.cityId > 0){
      this.getWardData(this.object.cityId);
    }
  }

  //danh sách tỉnh thành
  async getRegionData(){
    this.utilitiesService.searchListTinhThanh({}).then((res)=>{
      if(res?.statusCode == STATUS_API.SUCCESS){
        this.listTinhThanh = res.data;
        console.log(res.data);
      }
    });
  }
  //danh sách quận huyện
  async getCityData(regionId: any){
    let body : any = {
      regionId: regionId
    }
    this.utilitiesService.searchListQuanHuyen(body).then((res)=>{
      if(res?.statusCode == STATUS_API.SUCCESS){
        this.listQuanHuyen = res.data;
      }
    });
  }
  //danh sách phường xã
  async getWardData(cityId: any){
    let body : any = {
      cityId: cityId
    }
    this.utilitiesService.searchListPhuongXa(body).then((res)=>{
      if(res?.statusCode == STATUS_API.SUCCESS){
        this.listPhuongXa = res.data;
      }
    });
  }
  
  async changeTinhThanh($event : any){
    this.getCityData($event.id);
  }
  async changeQuanHuyen($event : any){
    this.getWardData($event.id);
  }
  async updateThongTinKhuVuc(){
    let body = this.formData.value;
    this._service.updateThongTinKhuVuc(body).then((res)=>{
      if(res?.statusCode == STATUS_API.SUCCESS && res.data > 0){
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
      }else{
        this.notification.error(MESSAGE.ERROR, MESSAGE.ERROR);
      }
    });
  }
  closeModal() {
    this.dialogRef.close();
  }
}