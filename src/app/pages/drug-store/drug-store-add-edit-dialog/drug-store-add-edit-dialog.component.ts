import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {
  DrugStorePickerListDialogComponent
} from "../drug-store-picker-list-dialog/drug-store-picker-list-dialog.component";
import {Validators} from "@angular/forms";
import {BaseComponent} from "../../../component/base/base.component";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";
import {TinhThanhsService} from "../../../services/categories/tinh-thanhs.service";
import {TypeBasisService} from "../../../services/categories/type-basis.service";
import { STATUS_API } from '../../../constants/message';
import {AccountPickerListDialogComponent} from "../../account/account-picker-list-dialog/account-picker-list-dialog.component";
import {
  BankAccountListDialogComponent
} from "../../utilities/bank-account/bank-account-list-dialog/bank-account-list-dialog.component";

@Component({
  selector: 'drug-store-add-edit-dialog',
  templateUrl: './drug-store-add-edit-dialog.component.html',
  styleUrl: './drug-store-add-edit-dialog.component.css'
})
export class DrugStoreAddEditDialogComponent extends BaseComponent implements OnInit {
  checkTab: string = 'main-information';
  listTinhThanh: any[] = [];
  listTypeBasis: any[] = [];
  listTypeInvoice: any[] = [
    {id: 1, nameType: "Hóa đơn bán hàng"},
    {id: 2, nameType: "Hóa đơn giá trị gia tăng"}
  ];
  listTypeSignInvoice: any[] = [
    {id: 1, nameType: "HSM ký mềm"},
    {id: 2, nameType: "Ký token"},
    {id: 3, nameType: "Ký SmartCA"},
  ];
  listTypeMessage: any[] = [
    {id: 1, nameType: "Gửi tin thường"},
    {id: 2, nameType: "Gửi tin kèm hình ảnh"},
  ];
  listTheme = [
    {id: 0, name: 'Màu trắng'},
    {id: 1, name: 'Màu xanh biển'},
    {id: 2, name: 'Màu xanh lá'},
    {id: 3, name: 'Màu cam' },
  ];

  hideConnectivityPassword = true;
  hideConnEInvoicePassword = true;
  hidePassServiceEInvoice = true;
  hideConnEInvoiceSerialCert = true;
  hideSignedString = true;
  hideLinkConnectEInvoice = true;
  hideConnectivityPasswordMedical = true;
  hideZaloKey = true;
  hideTokenZalo = true;
  hideRefreshTokenZalo = true;
  hideQRDeviceToken = true;

  constructor(
    injector: Injector,
    public _service: NhaThuocsService,
    private tinhThanhsService: TinhThanhsService,
    private typeBasisService: TypeBasisService,
    public dialogRef: MatDialogRef<DrugStoreAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public drugStore: any) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [],
      maNhaThuoc: [''],
      adminUsername: [''],
      nguoiDaiDien: [''],
      tenNhaThuoc: ['', Validators.required],
      diaChi: [''],
      soKinhDoanh: [''],
      email: ['', Validators.email],
      dienThoai: [''],
      mobile: [''],
      tinhThanhId: [0],
      duocSy: [''],
      isGeneralPharmacy: [false],
      deliveryPolicy: [''],
      contentThankYou: [''],
      footerPrint: [''],
      nguoiPhuTrach: ['', Validators.required],
      nhaThuocQuanLy: [''],
      paidAmount: [null],
      paidMoney: [null],
      idTypeBasic: [null],
      totalNumberInvoices: [null],
      description: [''],
      ghiChu: [''],
      isConnectivity: [false],
      connectivityCode: [''],
      connectivityUserName: [''],
      connectivityPassword: [''],
      upgradeToPlus: [false],
      connEInvoiceUserName: [''],
      connEInvoicePassword: [''],
      nameServiceEInvoice: [''],
      passServiceEInvoice: [''],
      connEInvoiceSerialCert: [''],
      signedString: [''],
      linkConnectEInvoice: [''],
      eInvoiceTotalNumbers: [null],
      formNumberInvoice: [''],
      symbolCodeInvocie: [''],
      typeInvoice: [null],
      typeSendEinvocie: [null],
      connectivityCodeMeidcal: [''],
      connectivityPasswordMedical: [''],
      appId: [''],
      zaloKey: [''],
      tokenZalo: [''],
      refreshTokenZalo: [''],
      typeMessage: [null],
      qrdeviceName: [''],
      qrdeviceToken: [''],
      simData: [''],
      slugCustomerWebsite: [''],
      googleLocationCustomerWebsite: [''],
      mainSloganCustomerWebsite: [''],
      subSloganCustomerWebsite: [''],
      themeIdCustomerWebsite: [0],
      chainLinkId: [null],
      cityId: [null],
      drugStoreTypeId: [null],
      isNationalDBConnected: [null],
      isPaid: [null],
      paymentStatus: [null],
      regionId: [null],
      wardId: [null],
      administrator: [null],
      maNhaThuocCha: [null],
      hoatDong: [null]
    });
  }

  async ngOnInit() {
    this.getDataFilter();
    if (this.isUpdateView()) {
      const data = await this._service.getDetailByCode(this.drugStore?.maNhaThuoc);
      if (data?.data) {
        this.drugStore = Object.assign({}, this.drugStore, data.data);
        this.formData.patchValue(this.drugStore);
      }
    } else {
      const data = await this._service.getNewStoreCode();
      if(data?.data){
        this.formData.patchValue({
          maNhaThuoc: data?.data,
          hoatDong: true
        });
      }
    }
  }

  getDataFilter() {
    // Tỉnh thành
    this.tinhThanhsService.searchList({}).then((res) => {
      if (res?.statusCode == STATUS_API.SUCCESS) {
        this.listTinhThanh = res.data;
      }
    });
    // Chính sách bán hàng
    this.typeBasisService.searchList({}).then((res) => {
      if (res?.statusCode == STATUS_API.SUCCESS) {
        this.listTypeBasis = res.data;
      }
    });
  }

  getNameTinhThanh() {
    let item = this.listTinhThanh.find(item => item.id === this.drugStore.tinhThanhId);
    return item ? item.tenTinhThanh : '';
  }

  getNameTypeInvoice() {
    let item = this.listTypeInvoice.find(item => item.id === this.drugStore.typeInvoice);
    return item ? item.nameType : '';
  }

  getNameTypeSignInvoice() {
    let item = this.listTypeSignInvoice.find(item => item.id === this.drugStore.typeSendEinvocie);
    return item ? item.nameType : '';
  }

  getNameTypeMessage() {
    let item = this.listTypeMessage.find(item => item.id === this.drugStore.typeMessage);
    return item ? item.nameType : '';
  }

  getNameTheme() {
    let item = this.listTheme.find(item => item.id === this.drugStore.themeIdCustomerWebsite);
    return item ? item.name : '';
  }

  async saveEdit() {
    let body = this.formData.value;
    let data = await this.save(body);
    if (data) {
      this.dialogRef.close(data);
    }
  }

  isCreateView() {
    return !this.drugStore?.maNhaThuoc;
  }

  isUpdateView() {
    return this.drugStore?.maNhaThuoc;
  }

  isSuperUser() {
    return this.authService.isSuperUser();
  }

  async openUserPickerDialog() {
    const dialogRef = this.dialog.open(AccountPickerListDialogComponent, {
      data: null,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.formData.patchValue({
          administrator: result.id,
          nguoiPhuTrach: result.tenDayDu
        });
      }
    });
  }

  async openDrugStorePickerDialog() {
    const dialogRef = this.dialog.open(DrugStorePickerListDialogComponent, {
      data: null,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.formData.patchValue({
          maNhaThuocCha: result.id,
          nhaThuocQuanLy: result.tenNhaThuoc
        });
      }
    });
  }

  async openUploadImageDialog(){

  }

  async openBankAccountListDialog(){
    this.dialog.open(BankAccountListDialogComponent, {
      data: this.drugStore?.maNhaThuoc,
      width: '600px',
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
