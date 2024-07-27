import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ThuocService } from '../../../services/products/thuoc.service';
import { SETTING } from '../../../constants/setting';
import { DrugUpdatePriceForChildStoreDialogComponent } from '../drug-update-price-for-child-store-dialog/drug-update-price-for-child-store-dialog.component';
import { MESSAGE, STATUS_API } from '../../../constants/message';
import { LOAI_SAN_PHAM } from '../../../constants/config';
import { NhomThuocService } from '../../../services/products/nhom-thuoc.service';
import { DonViTinhService } from '../../../services/products/don-vi-tinh.service';
import { ProductTypesService } from '../../../services/products/product-types-service';

@Component({
  selector: 'drug-update-common-infos-dialog',
  templateUrl: './drug-update-common-infos-dialog.component.html',
  styleUrls: ['./drug-update-common-infos-dialog.component.css'],
})
export class DrugUpdateCommonInfosDialogComponent extends BaseComponent implements OnInit {
  drug: any = {};
  listNhomThuoc: any[] = []
  listDonViTinh: any[] = []
  listProductTypes: any[] = []
  noteType: any = 0;

  // Permitted
  permittedFields: any = {
    drug_ViewInputPrice: this.havePermissions(['THUOC_XEMGN']),
  }

  // Settings
  enableUpdateDrugPriceForChildStore = this.authService.getSettingByKey(SETTING.ENABLE_UPDATE_DRUG_PRICE_FOR_CHILD_STORE).activated;
  settingOwnerPrices = this.authService.getSettingByKey(SETTING.SETTING_OWNER_PRICES).activated;
  refStoreForProducts = this.authService.getSettingByKey(SETTING.REF_STORE_FOR_PRODUCTS);

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: ThuocService,
    private nhomThuocService: NhomThuocService,
    private donViTinhService: DonViTinhService,
    private productTypesService: ProductTypesService,
    public dialogRef: MatDialogRef<DrugUpdateCommonInfosDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(injector, _service);
  }

  async ngOnInit() {
    if(this.data.noteType) this.noteType = this.data.noteType;
    if (this.data.thuocThuocId && this.data.thuocThuocId > 0) {
      const data = await this.detail(this.data.thuocThuocId);
      if (data) {
        this.drug = data;
        this.drug.heSo = this.drug.heSo > 0 ? this.drug.heSo : 1;
        this.drug.giaBanLe = this.data.maDonViTinhDaChon == this.drug.donViThuNguyenMaDonViTinh ? this.data.giaBanLe / this.drug.heSo : this.data.giaBanLe;
        this.drug.giaNhap = this.data.maDonViTinhDaChon == this.drug.donViThuNguyenMaDonViTinh ? this.data.giaNhap / this.drug.heSo : this.data.giaNhap;
        this.getDataFilter();
      }
      else {
        this.notification.error(MESSAGE.ERROR, 'Không tồn tại mặt hàng có mã ' + this.data.thuocThuocId);
      }
    }
  }

  getDataFilter() {
    // Nhóm thuốc
    this.nhomThuocService.searchList({ maNhaThuoc: this.refStoreForProducts.value }).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhomThuoc = res.data
      }
    });
    // Đơn vị tính
    this.donViTinhService.searchList({ maNhaThuoc: this.refStoreForProducts.value }).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listDonViTinh = res.data
      }
    });
    // Loại thuốc
    this.productTypesService.searchList({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listProductTypes = res.data;
      }
    });
  }

  genBarcode() {
    this._service.generateBarCode({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.drug.barCode = res.data;
      }
    });
  }

  onUnitChange(){
    this.drug.tenDonViTinhThuNguyen = this.getUnitName(this.drug.donViThuNguyenMaDonViTinh);
  }

  onRetailUnitChange(){
    this.drug.tenDonViTinhXuatLe = this.getUnitName(this.drug.donViXuatLeMaDonViTinh);
  }

  getUnitName(id: any) {
    let name = '';
    this.listDonViTinh.forEach(x => {
      if (x.id == id) name = x.tenDonViTinh;
    })
    return name;
  }

  validateInputParams(){
    if(this.drug.tenThuoc == null || this.drug.tenThuoc == ''){
      this.notification.error(MESSAGE.ERROR, 'Chưa nhập tên thuốc.');
      return false;
    }
    if(this.drug.heSo == null || this.drug.heSo == '' || this.drug.heSo <= 0){
      this.notification.error(MESSAGE.ERROR, 'Chưa nhập hệ số.');
      return false;
    }
    if(this.drug.donViXuatLeMaDonViTinh == this.drug.donViThuNguyenMaDonViTinh){
      this.notification.error(MESSAGE.ERROR, 'Đơn vị tính không được trùng nhau.');
      return false;
    }
    return true;
  }

  async onUpdate() {
    if(!this.validateInputParams()) return;
    let body = {
      drugId: this.drug.id,
      drugName: this.drug.tenThuoc,
      unitId: this.drug.donViThuNguyenMaDonViTinh,
      retailUnitId: this.drug.donViXuatLeMaDonViTinh,
      inPrice: this.drug.giaNhap,
      outPrice: this.drug.giaBanLe,
      outBatchPrice: this.drug.giaBanBuon,
      factors: this.drug.heSo,
      decscription: this.drug.thongTin,
      barcode: this.drug.barCode,
      groupId: this.drug.nhomThuocMaNhomThuoc,
      productTypeId: this.drug.productTypeId,
      noteType: this.noteType
    };
    let res = await this._service.saveDraftListDrug(body);
    if (res?.status == STATUS_API.SUCCESS && res.data) {
      this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
      this.dialogRef.close(res.data);
    } else {
      this.notification.error(MESSAGE.ERROR, 'Cập nhật không thành công.');
    }
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  closeModal() {
    this.dialogRef.close();
  }

}