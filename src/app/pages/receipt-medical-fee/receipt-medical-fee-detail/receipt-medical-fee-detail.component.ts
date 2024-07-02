import { Component, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { MedicalFeeReceiptsService } from '../../../services/medical/medical-fee-receipts.service';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { calculateAge } from '../../../utils/date.utils';
import { PaymentTypeService } from '../../../services/categories/payment-type.service';
import { SETTING } from '../../../constants/setting';
import { LOAI_PHIEU, RECORD_STATUS } from '../../../constants/config';

@Component({
  selector: 'app-receipt-medical-fee',
  templateUrl: './receipt-medical-fee-detail.component.html',
  styleUrls: ['./receipt-medical-fee-detail.component.css'],
})
export class ReceiptMedicalFeeDetailComponent extends BaseComponent implements OnInit {
  title: string = "PHIẾU THU TIỀN";
  RECORD_STATUS = RECORD_STATUS;
  data: any = {};
  customer: any = {};
  listPaymentType: any[] = [];
  showMoreForm: boolean = true;
  expandLabel: string = '[-]';
  LOAI_PHIEU = LOAI_PHIEU;

  // Settings
  enablePaymentQR = this.authService.getSettingByKey(SETTING.ENABLE_PAYMENT_QR).activated;

  constructor(
    injector: Injector,
    private _service: MedicalFeeReceiptsService,
    private khachHangService: KhachHangService,
    private paymentTypeService: PaymentTypeService,
    private titleService: Title,
  ) {
    super(injector, _service);
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.loadDataOpt();
    this.getId();
    if (this.idUrl) {
      let data = await this.detail(this.idUrl);
      data.discountPercent = data.debtAmount > 0 ? (data.discount / data.debtAmount) * 100 : 0;
      console.log(data);
      this.data = data;
      if (data.idCus > 0) {
        this.khachHangService.getDetail(data.idCus).then((res) => {
          if (res && res.data) {
            this.customer = res.data;
            this.customer.age = this.customer.birthDate != null ? calculateAge(this.customer.birthDate) : '';
            console.log(this.customer);
          }
        });
      }
    }
  }
  onDetailNote(item: any) {
    if (item.typeNote == LOAI_PHIEU.PHIEU_KHAM_BENH) {
      this.goToUrl('/management/medical-note/detail', item.noteId);
    }
    else if(item.typeNote == LOAI_PHIEU.PHIEU_DICH_VU){
      this.goToUrl('/management/service-note/detail', item.noteId);
    }
  }
  expandForm() {
    this.showMoreForm = !this.showMoreForm;
    this.expandLabel = this.showMoreForm ? '[-]' : '[+]';
  };
  loadDataOpt() {
    this.paymentTypeService.searchList({}).then((res) => {
      this.listPaymentType = res?.data;
    });
  }
}
