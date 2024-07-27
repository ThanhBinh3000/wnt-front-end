import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ThuocService } from '../../../services/products/thuoc.service';
import { SETTING } from '../../../constants/setting';
import { DrugUpdatePriceForChildStoreDialogComponent } from '../drug-update-price-for-child-store-dialog/drug-update-price-for-child-store-dialog.component';
import { MESSAGE, STATUS_API } from '../../../constants/message';

@Component({
  selector: 'drug-update-inprice-dialog',
  templateUrl: './drug-update-inprice-dialog.component.html',
  styleUrls: ['./drug-update-inprice-dialog.component.css'],
})
export class DrugUpdateInpriceDialogComponent extends BaseComponent implements OnInit {
  drug: any = {};

  // Permitted
  permittedFields: any = {
    drug_ViewInputPrice: this.havePermissions(['THUOC_XEMGN']),
  }

  // Settings
  enableUpdateDrugPriceForChildStore = this.authService.getSettingByKey(SETTING.ENABLE_UPDATE_DRUG_PRICE_FOR_CHILD_STORE).activated;
  settingOwnerPrices = this.authService.getSettingByKey(SETTING.SETTING_OWNER_PRICES).activated;

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: ThuocService,
    public dialogRef: MatDialogRef<DrugUpdateInpriceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(injector, _service);
  }

  async ngOnInit() {
    if (this.data.thuocThuocId && this.data.thuocThuocId > 0) {
      const data = await this.detail(this.data.thuocThuocId);
      this.drug = data;
    }
    if (this.settingOwnerPrices && this.isSlaveDrugStore()) {
      if (this.drug.inventory) {
        this.drug.giaBanLe = this.drug.inventory.outPrice;
        this.drug.giaNhap = this.drug.inventory.lastInPrice;
      }
    }
    this.drug.heSo = this.drug.heSo > 0 ? this.drug.heSo : 1;
    if (this.drug.donViXuatLeMaDonViTinh == this.data.donViTinhMaDonViTinh) {
      this.drug.giaBanBuon = Math.round(this.drug.giaBanBuon / this.drug.heSo);
      this.drug.tenDonViTinh = this.drug.tenDonViTinhXuatLe;
    }
    else {
      this.drug.giaBanLe = this.drug.giaBanLe * this.drug.heSo;
      this.drug.giaNhap = this.drug.giaNhap * this.drug.heSo;
      this.drug.tenDonViTinh = this.drug.tenDonViTinhThuNguyen;
    }
    this.drug.giaBanLeCu = this.drug.giaBanLe;
    this.drug.giaNhapCu = this.drug.giaNhap;
    this.drug.giaBanBuonCu = this.drug.giaBanBuon;
    this.drug.maDonViTinhDaChon = this.data.donViTinhMaDonViTinh;
    this.onOutpriceChange('outprice');
  }

  onOutpriceChange(type: any) {
    if (type == 'outprice' || type == 'inprice') {
      this.drug.rateRevenue = this.drug.giaNhap > 0
        ? parseFloat((((this.drug.giaBanLe - this.drug.giaNhap) / this.drug.giaNhap) * 100).toFixed(2))
        : 0;
    }
    else {
      this.drug.giaBanLe = this.drug.rateRevenue > 0 ? (this.drug.giaNhap * ((this.drug.rateRevenue / 100) + 1)) : 0;
    }
  }

  async onUpdateDrugPrice() {
    if(!this.drug.giaNhap){
      this.notification.error(MESSAGE.ERROR, 'Giá nhập không được để trống.');
      return;
    }
    let res = await this._service.updateDrugPrice(this.drug);
    if (res?.status == STATUS_API.SUCCESS && res.data) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      this.dialogRef.close(this.drug);
    } else {
      this.notification.error(MESSAGE.ERROR, 'Cập nhật không thành công.');
    }
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getMaNhaThuocCha() {
    return this.authService.getNhaThuoc().maNhaThuocCha;
  }

  isSlaveDrugStore() {
    return this.authService.getNhaThuoc().isSlaveDrugStore;
  }

  onUpdatePriceChildStore(type: any) {
    this.drug.isUpdateInPrice = type == 0;
    const dialogRef = this.dialog.open(DrugUpdatePriceForChildStoreDialogComponent, {
      data: this.drug,
      width: '600px',
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

}