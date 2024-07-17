import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../../../component/base/base.component";
import {MESSAGE} from "../../../constants/message";
import {ThuocService} from "../../../services/products/thuoc.service";
import printJS from "print-js";

@Component({
  selector: 'account-add-edit-dialog',
  templateUrl: './drug-bar-code-printing-dialog.component.html',
  styleUrl: './drug-bar-code-printing-dialog.component.css'
})
export class DrugBarCodePrintingDialogComponent extends BaseComponent implements OnInit {

  selectedHoatChat: number = 2;
  hoatChatList = [
    {name: 'AMK, Fleming, Ceclor, Klavunamox, Oxnas...', selected: false},
    {name: 'Zitromax 200mg/5ml', selected: false},
    {name: 'Anaferon', selected: true},
    {name: 'Klacid', selected: false},
    {name: 'Khác...', selected: false}
  ];

  constructor(
    injector: Injector,
    private _service: ThuocService,
    public dialogRef: MatDialogRef<DrugBarCodePrintingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public kieuIn: any) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [],
      loaiIn: [''],
      slTem: [''],
      khongInTenNhaThuoc: [true],
      chat: [''],
      hoatChat: [''],
      cachPha: [''],
      cachUong: ['']
    });
  }

  async ngOnInit() {
    this.formData.patchValue({
      loaiIn: 'In2Tem'
    })
  }

  async print() {
    this.formData.value.slTem = this.formData.value.slTem || 1;
    this.dataTable.push(this.formData.value)
    let res = await this._service.preview(this.dataTable)
    if (res?.data) {
      this.printSrc = res.data.pdfSrc;
      this.pdfSrc = this.PATH_PDF + res.data.pdfSrc;
      this.showDlgPreview = true;
      printJS({printable: this.printSrc, type: 'pdf', base64: true})
    } else {
      this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
    }
    this.dataTable = [];
  }

  closeModal() {
    this.dialogRef.close();
  }

  onChange() {
    const hoatChatData = [
      {
        hoatChat: 'AMK, Fleming, Ceclor, Klavunamox, Oxnas...',
        cachPha: 'Đổ nước đun sôi để nguội vào lọ rồi lắc đều sao cho thuốc tan hoàn toàn được hỗn dịch đến vạch định mức trên lọ.',
        cachUong: 'Ngày uống.....lần mỗi lần.....ml.',
        loaiIn: 'InHuongDan0'
      },
      {
        hoatChat: 'Zitromax 200mg/5ml',
        cachPha: 'Đổ 9ml nước đun sôi để nguội vào lọ rồi lắc đều sao cho thuốc tan hoàn toàn sẽ thu được hỗn dịch tổng là 15ml.',
        cachUong: 'Ngày uống 1 lần.....ml.',
        loaiIn: 'InHuongDan1'
      },
      {
        hoatChat: 'Anaferon',
        cachPha: 'Trong 24h đầu cho bé ngậm 6 viên chia 6 lần, từ ngày thứ 2: ngậm 3 viên chia 3 lần (sáng, trưa, tối).',
        cachUong: 'Bé không ngậm được cả viên thì nghiền nhỏ thuốc cho dần vào đầu lưỡi của bé để thuốc hấp thu dần trong khoang miệng (không nên pha thuốc với nước, cháo, sữa, ...).',
        loaiIn: 'InHuongDan2'
      },
      {
        hoatChat: 'Klacid',
        cachPha: 'Đổ 32ml nước đun sôi để nguội vào lọ rồi lắc đều sao cho thuốc tan hoàn toàn sẽ thu được hỗn dịch tổng là 15ml.',
        cachUong: 'Ngày uống 2 lần mỗi lần.....ml.',
        loaiIn: 'InHuongDan3'
      }
    ];
    const defaultData = {
      hoatChat: 'Khác...',
      cachPha: '',
      cachUong: '',
      loaiIn: 'InHuongDan'
    };
    const selectedData = hoatChatData[this.selectedHoatChat] || defaultData;
    this.formData.patchValue(selectedData);
  }
}
