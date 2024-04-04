import {Component, ElementRef, Injector, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {UserProfileService} from "../../../../services/system/user-profile.service";
import {MatDialog} from "@angular/material/dialog";
import {NhaThuocsService} from "../../../../services/system/nha-thuocs.service";
import {BaseComponent} from "../../../../component/base/base.component";
@Component({
  selector: 'drug-store-list',
  templateUrl: './drug-store-list.component.html',
  styleUrl: './drug-store-list.component.css'
})
export class DrugStoreListComponent extends BaseComponent implements OnInit {
  title: string = "Tra cứu thông tin nhà thuốc";
  @ViewChild('titleCode') titleCodeRef?: ElementRef;
  @ViewChild('titleName') titleNameRef?: ElementRef;
  @ViewChild('titleAddress') titleAddressRef?: ElementRef;
  @ViewChild('titlePhone') titlePhoneRef?: ElementRef;
  contentCodeLeft: number = 0;
  contentNameLeft: number = 0;
  contentAddressLeft: number = 0;
  contentPhoneLeft: number = 0;
  drugStoreCode: string = '';
  drugStoreTypes = [
    {
        name: "--Tất cả--", value: -1
    },
    {
        name: "NT LT", value: 101
    },
    {
        name: "NT QL", value: 102
    },
    {
        name: "Công ty", value: 103
    },
    {
        name: "Phòng khám", value: 104
    },
    {
        name: "Đặt hàng", value: 105
    },
    {
        name: "Nhà tổng đặt hàng", value: 106
    },
];
drugStorePaymentTypes = [
  {
      name: "--Tất cả--", value: -1
  },
  {
      name: "Chưa thanh toán", value: 0
  },
  {
      name: "Thanh toán chưa đủ", value: 1
  },
  {
      name: "Đã thanh toán", value: 2
  }
];
expiredTypes = [
  {
      name: "--Tất cả--", value: -1
  },
  {
      name: "Không có hạn", value: 0
  },
  {
      name: "Có hạn", value: 1
  },
  {
      name: "Dưới 30 ngày", value: 2
  },
  {
      name: "Dưới 7 ngày", value: 3
  },
  {
      name: "Đã hết hạn", value: 4
  },
];
drugStoreDeployTypes = [
  {
      name: "--Tất cả--", value: -1
  },
  {
      name: "Chưa triển khai", value: 0
  },
  {
      name: "Đã triển khai", value: 1
  }
];
hideColumns = [
  {
      id: 0, name: "--Tất cả--", value: -1
  },
  {
      id: 1, name: "Địa chỉ", disable: false
  },
  {
      id: 2, name: "Người đại diện", disable: false
  },
  {
      id: 3, name: "Người tạo", disable: false
  },
  {
      id: 4, name: "Ngày tạo - Ngày hh", disable: false
  },
  {
      id: 5, name: "TK LT", disable: false
  },
  {
      id: 6, name: "CS Bán hàng", disable: false
  },
  {
      id: 7, name: "Ghi chú kinh doanh", disable: false
  },
  {
      id: 8, name: "Ghi chú triển khai", disable: false
  },
  {
      id: 9, name: "Kết quả triển khai", disable: false
  },
  {
      id: 10, name: "Tổng tiền", disable: false
  },
  {
      id: 11, name: "Ngày thu tiền", disable: false
  }
];
typeDateItem = [
  {
      id: 0, name: "--Tất cả--", value: -1
  },
  {
      id: 1, name: "Ngày tạo nhà thuốc", disable: false
  },
  {
      id: 2, name: "Ngày giao dịch", disable: false
  },
  {
      id: 3, name: "Ngày thu tiền", disable: false
  }
];
znsTypes = [
  {
      name: "--Tất cả--", value: 0
  },
  {
      name: "Xác nhận thanh toán", value: 1
  },
  {
      name: "Tạo tài khoản", value: 3
  }
];
connectivityTypes = [
  {
      name: "--Tất cả--", value: 0
  },
  {
      name: "Đã liên thông", value: 1
  },
  {
      name: "Chưa liên thông", value: 3
  }
];
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: NhaThuocsService,
    private dialog: MatDialog
  ) {
    super(injector, _service);
    this.formData = this.fb.group({

    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPage();
    console.log(this.dataTable)
  }

  onTableScroll() {
    const titleCode = this.titleCodeRef?.nativeElement;
    const titleName = this.titleNameRef?.nativeElement;
    const titleAddress = this.titleAddressRef?.nativeElement;
    const titlePhone = this.titlePhoneRef?.nativeElement;
    const titleCodeWidth = titleCode.offsetWidth - 2; // - border
    const titleNameWidth = titleName.offsetWidth - 2; // - border
    const titleAddressWidth = titleAddress.offsetWidth - 2; // - border
    titleCode.style.left = '-1px'; // - border
    this.contentCodeLeft = -1; // - border
    titleName.style.left = titleCodeWidth + 'px';
    this.contentNameLeft = titleCodeWidth;
    titleAddress.style.left = titleCodeWidth + titleNameWidth + 'px';
    this.contentAddressLeft = titleCodeWidth + titleNameWidth;
    titlePhone.style.left= titleCodeWidth + titleNameWidth + titleAddressWidth + 'px';
    this.contentPhoneLeft = titleCodeWidth + titleNameWidth + titleAddressWidth;
  }

  getPhoneNumbers(item: any) {
    let result = '';
    if (item.mobile != null && item.mobile.length > 0) {
      result = item.mobile;
    }
    if (item.dienThoai != null && item.dienThoai.length > 0) {
      if (result.length > 0) {
        result += ("<br>" + item.dienThoai);
      }
      else {
        result = item.dienThoai;
      }
    }
    return result;
  }

  onCheckConnectivity(item: any) {

  }
}
