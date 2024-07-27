import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ThuocService } from '../../../services/products/thuoc.service';
import { SETTING } from '../../../constants/setting';
import { NhaThuocsService } from '../../../services/system/nha-thuocs.service';
import { MESSAGE, STATUS_API } from '../../../constants/message';

@Component({
  selector: 'drug-update-price-for-child-store-dialog',
  templateUrl: './drug-update-price-for-child-store-dialog.component.html',
  styleUrls: ['./drug-update-price-for-child-store-dialog.component.css'],
})
export class DrugUpdatePriceForChildStoreDialogComponent extends BaseComponent implements OnInit {
  listChildStores: any = [];

  // Permitted
  permittedFields: any = {
    drug_ViewInputPrice: !this.havePermissions(['THUOC_XEMGN']),
  }

  // Settings
  enableUpdateDrugPriceForChildStore = this.authService.getSettingByKey(SETTING.ENABLE_UPDATE_DRUG_PRICE_FOR_CHILD_STORE).activated;
  settingOwnerPrices = this.authService.getSettingByKey(SETTING.SETTING_OWNER_PRICES).activated;

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: ThuocService,
    private nhaThuocService: NhaThuocsService,
    public dialogRef: MatDialogRef<DrugUpdatePriceForChildStoreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(injector, _service);
  }

  async ngOnInit() {
    let body = {
      maNhaThuocCha: this.getMaNhaThuoc(),
    };
    let res = await this.nhaThuocService.searchList(body);
    if (res?.status == STATUS_API.SUCCESS && res.data.length > 0) {
      this.listChildStores = res.data.filter((x: any) => x.maNhaThuoc != this.getMaNhaThuoc());
      this.listChildStores.forEach((x: any) => x.isCheck = true);
      console.log(this.listChildStores);
    }
  }

  async onUpdate() {
    var listStore = this.listChildStores.filter((x: any) => x.isCheck);
    if (listStore.length > 0) {
      this.data.storeCodes = listStore.map((x: any) => x.maNhaThuoc);
      let res = await this._service.updateDrugPriceForChildStore(this.data);
      if (res?.status == STATUS_API.SUCCESS && res.data) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        this.dialogRef.close(this.data);
      } else {
        this.notification.error(MESSAGE.ERROR, 'Cập nhật không thành công.');
      }
    }
    else {
      this.notification.success(MESSAGE.ERROR, 'Bạn chưa chọn nhà con nào.');
    }
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  isSlaveDrugStore() {
    return this.authService.getNhaThuoc().isSlaveDrugStore;
  }

  closeModal() {
    this.dialogRef.close();
  }

}