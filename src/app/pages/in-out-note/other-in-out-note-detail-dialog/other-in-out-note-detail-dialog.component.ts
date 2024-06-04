import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../../../component/base/base.component";
import {PhieuThuChiService} from "../../../services/thuchi/phieu-thu-chi.service";
import { LOAI_THU_CHI } from '../../../constants/config';
import {
  OtherInOutNoteAddEditDialogComponent
} from "../other-in-out-note-add-edit-dialog/other-in-out-note-add-edit-dialog.component";
import {MESSAGE} from "../../../constants/message";

@Component({
  selector: 'other-customer-in-out-note-detail-dialog',
  templateUrl: './other-in-out-note-detail-dialog.component.html',
  styleUrls: ['./other-in-out-note-detail-dialog.component.css'],
})
export class OtherInOutNoteDetailDialogComponent extends BaseComponent implements OnInit {
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
    public dialogRef: MatDialogRef<OtherInOutNoteDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super(injector, _service);
  }

  async ngOnInit() {
    if (this.data.id) {
      this.noteDetail = await this.detail(this.data.id);
    }
  }

  is9274() {
    return this.getMaNhaThuoc() == '9274';
  }

  getNguoiNhanData() {
    return this.is9274() ? this.noteDetail?.nhanVienText : this.noteDetail?.nguoiNhan;
  }

  getTitle() {
    let title = '';
    switch (this.noteDetail?.loaiPhieu) {
      case LOAI_THU_CHI.THU_KHAC:
        title = 'Thu khác';
        break;
      case LOAI_THU_CHI.CHI_KHAC:
        title = 'Chi khác';
        break;
      case LOAI_THU_CHI.CHI_PHI_KINH_DOANH:
        title = 'Chi phí kinh doanh';
        break;
    }
    return title;
  }

  getMaNhaThuoc() {
    return this.authService?.getNhaThuoc()?.maNhaThuoc;
  }

  async onPrint(printType: any) {

  }

  async openAddEditDialog(id: any) {
    const config = {
      data: {loaiPhieu: this.noteDetail.loaiPhieu, id: id},
      width: '600px',
    };
    this.dialog.open(OtherInOutNoteAddEditDialogComponent, config);
  }

  override async delete() {
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: 'Bạn thực sự muốn xóa phiếu này?',
      okText: 'Đồng ý',
      cancelText: 'Không',
      okDanger: true,
      width: 310,
      onOk: async () => {
        this.service.delete({id: this.noteDetail?.id}).then(async (res) => {
          if (res && res.data) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            this.closeModal(this.noteDetail);
          }
        });
      },
    });
  }

  closeModal(data: any = null) {
    this.dialogRef.close(data);
  }

  protected readonly LOAI_THU_CHI = LOAI_THU_CHI;
}
