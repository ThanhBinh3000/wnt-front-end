import { Component, Inject, Injector, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { BaseComponent } from '../../../../component/base/base.component';
import { PhieuXuatService } from '../../../../services/inventory/phieu-xuat.service';
import { LOAI_PHIEU, TRANG_THAI_LIEN_THONG } from '../../../../constants/config';

@Component({
  selector: 'connectivity-note-guide-dialog',
  templateUrl: './connectivity-note-guide-dialog.component.html',
  styleUrls: ['./connectivity-note-guide-dialog.component.css'],
})
export class ConnectivityNoteGuideDialogComponent extends BaseComponent {

  constructor(
    injector: Injector,
    public dialogRef: MatDialogRef<ConnectivityNoteGuideDialogComponent>,
    private _service: PhieuXuatService,
    @Inject(MAT_DIALOG_DATA) public note: any,
  ) {
    super(injector, _service);
  }

  async ngOnInit() {
  }

  closeModal() {
    this.dialogRef.close();
  }

  getUrlDetail() {
    switch (this.note.maLoaiXuatNhap) {
      case LOAI_PHIEU.PHIEU_XUAT:
      case LOAI_PHIEU.PHIEU_KIEM_KE:
        return `/management/note-management/delivery-note-detail/${this.note.id}`;
      case LOAI_PHIEU.PHIEU_NHAP_TU_KH:
        return `/management/note-management/return-to-supplier-note-detail/${this.note.id}`;
      case LOAI_PHIEU.PHIEU_XUAT_HUY:
        return `/management/note-management/cancel-delivery-note-detail/${this.note.id}`;
      case LOAI_PHIEU.PHIEU_NHAP:
      case LOAI_PHIEU.PHIEU_KIEM_KE:
        return `/management/note-management/receipt-note-detail/${this.note.id}`;
      case LOAI_PHIEU.PHIEU_NHAP_TU_KH:
        return `/management/note-management/return-from-customer-note-detail/${this.note.id}`;
      default:
        return "";
    }
  }

  getUrlNoteEdit() {
    switch (this.note.maLoaiXuatNhap) {
      case LOAI_PHIEU.PHIEU_XUAT:
        return `/management/note-management/delivery-note-screen/${this.note.id}`;
      case LOAI_PHIEU.PHIEU_NHAP_TU_KH:
        return `/management/note-management/return-from-customer-note-screen/${this.note.id}`;
      case LOAI_PHIEU.PHIEU_XUAT_HUY:
        return `/management/note-management/cancel-delivery-note-detail/${this.note.id}`;
      case LOAI_PHIEU.PHIEU_NHAP:
        return `/management/note-management/receipt-note-screen/${this.note.id}`;
      case LOAI_PHIEU.PHIEU_NHAP_TU_KH:
        return `/management/note-management/return-to-supplier-note-screen/${this.note.id}`;
      default:
        return "";
    }
  }

  danhSachHDSuaLoi(){
    let dataViewDrugMissing = [
      {
          id: 1,
          title: "Hướng dẫn lỗi thuốc chưa có số đăng ký",
          contents: `<b>- Bước 1: Mở thiết lập thuốc liên thông</b>
              <p>
              Bấm vào
              <a href = "/Thuocs/MappingDrugForConnect" target = "_blank">đây</a>
              để mở thiết lập thuốc liên thông
              </p >
              <b>- Bước 2: Tìm thuốc và điền tên thuốc cần đăng ký liên thông.</b>
              <img image-error-directive="" style="width:50%" src="/assets/images//search-drug-reg.png" />
              <br/>
              <b>- Bước 3: Ấn vào dấu cộng.</b>
              <img image-error-directive="" style="width:50%" src="/assets/images/fix-reg.png" />
              <br />
              <b>- Bước 4: Điền số đăng ký và cập nhật.</b>
              <img image-error-directive="" style="width:50%" src="/assets/images/update-reg.png" />`,
      },
      {
          id: 2,
          title: "Hướng dẫn lỗi thuốc chưa có số số lô hoặc hạn dùng",
          contents: `<b>- Bước 1: Mở phiếu chứa thuốc chưa có số lô hoặc hạn dùng</b>
              <p>
              Bấm vào
              <a href="${this.getUrlNoteEdit()}" target="_blank">đây</a>
              để mở phiếu cần sửa
              </p>
              <b>- Bước 2: Nhấp chuột vào biểu tượng cuốn lịch để thêm số lô, hạn dùng.</b>
              <img image-error-directive="" style="width:50%" src="/assets/images/update-batchnum.png" />
              <br />
              <b>- Bước 3: Cập nhật số lô, hạn dùng.</b>
              <img image-error-directive="" style="width:50%" src="/assets/images/update-batchnum-drug.png" />
              <br />
              <b>- Bước 4: Ghi phiếu.</b>
              <img image-error-directive="" style="width:50%" src="/assets/images/update-note.png" />`
      }
  ];
  return dataViewDrugMissing.filter(i => i.id == this.note.typeLack)[0];
  }

  protected readonly TRANG_THAI_LIEN_THONG = TRANG_THAI_LIEN_THONG;
}
