import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from '../../../component/base/base.component';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { RegionService } from '../../../services/categories/region.service';
import { STATUS_API } from '../../../constants/message';

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
    @Inject(MAT_DIALOG_DATA) public customerID: any,
    private _service: KhachHangService,
    private regionService: RegionService,
    public dialogRef: MatDialogRef<RegionInformationEditDialogComponent>,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      cityId : [0]
    });
  }
  ngAfterViewInit(): void {
    throw new Error('Method not implemented.');
  }
  async ngOnInit() {
    this.getRegionData();
  }
  //danh sách tỉnh thành
  async getRegionData(){
    this.regionService.searchList({}).then((res)=>{
      if(res?.statusCode == STATUS_API.SUCCESS){
        this.listTinhThanh = res.data.content;
        console.log(res.data);
      }
    });
  }
  closeModal() {
    this.dialogRef.close();
  }
}