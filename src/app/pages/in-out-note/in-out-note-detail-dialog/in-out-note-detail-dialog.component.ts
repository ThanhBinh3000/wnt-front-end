import {Component, Inject, Injector, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { PhieuThuChiService } from '../../../services/thuchi/phieu-thu-chi.service';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { NhaCungCapService } from '../../../services/categories/nha-cung-cap.service';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LOAI_THU_CHI} from "../../../constants/config";
import {
  OtherInOutNoteAddEditDialogComponent
} from "../other-in-out-note-add-edit-dialog/other-in-out-note-add-edit-dialog.component";
import {InOutNoteAddEditDialogComponent} from "../in-out-note-add-edit-dialog/in-out-note-add-edit-dialog.component";
import {SETTING} from "../../../constants/setting";

@Component({
  selector: 'in-out-note-detail-dialog',
  templateUrl: './in-out-note-detail-dialog.component.html',
  styleUrls: ['./in-out-note-detail-dialog.component.css'],
})
export class InOutNoteDetailDialogComponent extends BaseComponent implements OnInit {
  noteDetail: any;
  // Settings
  // Authorities
  inOutComingNoteCreate = true;
  inOutComingNoteWrite = true;
  inOutComingNoteDelete = true;
  inOutComingNotePrint = true;

  constructor(
    injector: Injector,
    private _service: PhieuThuChiService,
    public dialogRef: MatDialogRef<InOutNoteDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super(injector, _service);
  }

  async ngOnInit() {
    if (this.data.id) {
      this.noteDetail = await this.detail(this.data.id);
    }
  }

  getTitle() {
    let title = '';
    switch (this.noteDetail?.loaiPhieu) {
      case LOAI_THU_CHI.THU_NO_KHACH_HANG:
        title = 'Phiếu thu';
        break;
      case LOAI_THU_CHI.CHI_TRA_NO_NHA_CUNG_CAP:
        title = 'Phiếu chi';
        break;
      case LOAI_THU_CHI.THU_LAI_NHA_CUNG_CAP:
        title = 'Phiếu thu lại nhà cung cấp';
        break;
      case LOAI_THU_CHI.CHI_TRA_LAI_KHACH_HANG:
        title = 'Phiếu chi trả lại khách hàng';
        break;
    }
    return title;
  }

  getChiTiets() {
    let chiTiets = '';
    // this.noteDetail.chiTiets.forEach((detail: any) => {
    //   chiTiets += `${detail.dienGiai} - ${detail.amount} - ${detail.httt}\n`;
    // });
    return chiTiets;
  }

  async onPrint(printType: any) {

  }

  async openAddEditDialog(id: any) {
    const config = {
      data: {loaiPhieu: this.noteDetail.loaiPhieu, id: id},
      width: '600px',
    };
    this.dialog.open(InOutNoteAddEditDialogComponent, config);
  }

  closeModal() {
    this.dialogRef.close();
  }

  protected readonly LOAI_THU_CHI = LOAI_THU_CHI;
}
