import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {BaseComponent} from '../../../component/base/base.component';
import {UtilitiesService} from '../../../services/categories/utilities.service';
import {MESSAGE, STATUS_API} from '../../../constants/message';
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";
import {UserProfileService} from "../../../services/system/user-profile.service";
import {KhachHangService} from "../../../services/customer/khach-hang.service";

@Component({
  selector: 'app-region-information-edit-dialog',
  templateUrl: './region-information-edit-dialog.component.html',
  styleUrl: './region-information-edit-dialog.component.css'
})
export class RegionInformationEditDialogComponent extends BaseComponent implements OnInit {
  listTinhThanh: any[] = [];
  listQuanHuyen: any[] = [];
  listPhuongXa: any[] = [];

  constructor(
    injector: Injector,
    private _service: UtilitiesService,
    private nhaThuocsService: NhaThuocsService,
    private userProfileService: UserProfileService,
    private khachHangService: KhachHangService,
    public dialogRef: MatDialogRef<RegionInformationEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public object: any,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [null],
      code: [null],
      name: [null],
      address: [null],
      regionId: [null],
      cityId: [null],
      wardId: [null],
      controller: object.controller
    });
  }

  async ngOnInit() {
    await this.getDetail();
    await this.getListTinhThanh();
    await this.getListQuanHuyen(this.formData.get('regionId')?.value);
    await this.getListPhuongXa(this.formData.get('cityId')?.value);
  }

  async getDetail() {
    let res;
    switch (this.object.controller) {
      case 'khach-hangs':
        res = await this.khachHangService.getDetail(this.object.id);
        if (res?.status == STATUS_API.SUCCESS) {
          this.formData.patchValue({
            id: res.data.id,
            code: res.data.code,
            name: res.data.tenKhachHang,
            address: res.data.diaChi,
            regionId: res.data.regionId === 0 ? null : res.data.regionId,
            cityId: res.data.cityId === 0 ? null : res.data.cityId,
            wardId: res.data.wardId === 0 ? null : res.data.wardId,
          });
        }
        break;
      case 'nha-thuocs':
        res = await this.nhaThuocsService.getDetail(this.object.id);
        if (res?.status == STATUS_API.SUCCESS) {
          this.formData.patchValue({
            id: res.data.id,
            code: res.data.maNhaThuoc,
            name: res.data.tenNhaThuoc,
            address: res.data.diaChi,
            regionId: res.data.regionId === 0 ? null : res.data.regionId,
            cityId: res.data.cityId === 0 ? null : res.data.cityId,
            wardId: res.data.wardId === 0 ? null : res.data.wardId,
          });
        }
        break;
      case 'nguoi-dung':
        res = await this.userProfileService.getDetail(this.object.id);
        if (res?.status == STATUS_API.SUCCESS) {
          this.formData.patchValue({
            id: res.data.id,
            code: res.data.userName,
            name: res.data.tenDayDu,
            address: res.data.addresses,
            regionId: res.data.regionId === 0 ? null : res.data.regionId,
            cityId: res.data.cityId === 0 ? null : res.data.cityId,
            wardId: res.data.wardId === 0 ? null : res.data.wardId,
          });
        }
        break;
    }
  }

  async getListTinhThanh() {
    this._service.searchListTinhThanh({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listTinhThanh = res.data;
      }
    });
  }

  async getListQuanHuyen(tinhThanhId: any) {
    if (tinhThanhId) {
      let body: any = {
        regionId: tinhThanhId
      }
      this._service.searchListQuanHuyen(body).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          this.listQuanHuyen = res.data;
        }
      });
    }
  }

  async getListPhuongXa(quanHuyenId: any) {
    if (quanHuyenId) {
      let body: any = {
        cityId: quanHuyenId
      }
      this._service.searchListPhuongXa(body).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          this.listPhuongXa = res.data;
        }
      });
    }
  }

  async changeTinhThanh($event: any) {
    this.formData.patchValue({cityId: null, wardId: null});
    await this.getListQuanHuyen($event.id);
  }

  async changeQuanHuyen($event: any) {
    this.formData.patchValue({wardId: null});
    await this.getListPhuongXa($event.id);
  }

  override async save() {
    let body = this.formData.value;
    body.diaChi = body.address;
    this._service.updateThongTinKhuVuc(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.SUCCESS);
        this.dialogRef.close(body);
      }
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
