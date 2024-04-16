import {Component, Injector, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {BaseComponent} from "../../../../component/base/base.component";
import {NhaThuocsService} from "../../../../services/system/nha-thuocs.service";
import {STATUS_API} from "../../../../constants/message";
import {AuthService} from "../../../../services/auth.service";

@Component({
  selector: 'app-drug-store-information',
  templateUrl: './drug-store-information.component.html',
  styleUrl: './drug-store-information.component.css'
})
export class DrugStoreInformationComponent extends BaseComponent implements OnInit {
  title: string = "CÔNG TY TNHH WEB NHÀ THUỐC";
  idTypeBaseOption = [
    {
      value: 1,
      title: "Tự do"
    },
    {
      value: 2,
      title: "Bán lẻ"
    },
    {
      value: 3,
      title: "Đại lý"
    },
    {
      value: 4,
      title: "CTV"
    },
    {
      value: 5,
      title: "SCT"
    },
    {
      value: 6,
      title: "Đặt hàng"
    }
  ]

  constructor(
    private titleService: Title,
    injector: Injector,
    private nhaThuocsService: NhaThuocsService,
    // private authService: AuthService
  ) {
    super(injector, nhaThuocsService);
    this.titleService.setTitle(this.title);
    this.formData = this.fb.group({
      nguoiPhuTrach: [undefined],
      maNhaThuoc: [undefined],
      tenNhaThuoc: [undefined],
      diaChi: [undefined],
      soKinhDoanh: [undefined],
      dienThoai: [undefined],
      nguoiDaiDien: [undefined],
      email: [undefined],
      mobile: [undefined],
      duocSy: [undefined],
      ghiChu: [undefined],
      contentThankYou: [undefined],
      paidMoney: [undefined],
      deliveryPolicy: [undefined],
      idTypeBasic: [undefined],
      isConnectivity: [undefined],
    });
  }

  async ngOnInit() {
    let detail = await this.getDetailByCode(this.authService.getNhaThuoc().maNhaThuoc);
    this.formData.patchValue(detail);
  }

  async getDetailByCode(code: string) {
    if (code) {
      let res = await this.nhaThuocsService.getDetailByCode(code);
      if (res?.statusCode == STATUS_API.SUCCESS) {
        const data = res.data;
        return data;
      } else {
        return null;
      }
    }
  }

  onUploadImageDialog(logo: string) {

  }

  updateBankAccount() {

  }

  updateCustomerWebsiteInfo() {

  }
}
