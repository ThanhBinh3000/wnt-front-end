import {Component, Inject, Injector, OnInit} from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { PhieuThuChiService } from '../../../services/thuchi/phieu-thu-chi.service';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {
  OutComingSupplierNoteAddEditDialogComponent
} from "../out-coming-supplier-note-add-edit-dialog/out-coming-supplier-note-add-edit-dialog.component";
import {MESSAGE, STATUS_API} from "../../../constants/message";

@Component({
  selector: 'out-coming-supplier-note-detail-dialog',
  templateUrl: './out-coming-supplier-note-detail-dialog.component.html',
  styleUrls: ['./out-coming-supplier-note-detail-dialog.component.css'],
})
export class OutComingSupplierNoteDetailDialogComponent extends BaseComponent implements OnInit {
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
    public dialogRef: MatDialogRef<OutComingSupplierNoteDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super(injector, _service);
  }

  async ngOnInit() {
    if (this.data.id) {
      this.noteDetail = await this.detail(this.data.id);
      const body = {
        id: this.data.id,
        supplierId: this.noteDetail?.supplierId,
      }
      let res = await this._service.getOutComingSupplierDebt(body);
      if (res?.status == STATUS_API.SUCCESS) {
        this.noteDetail = {...this.noteDetail, ...res.data};
      }
    }
  }

  getChiTiets() {
    let chiTiets = '';
    this.noteDetail?.debtNotes?.forEach((detail: any) => {
      chiTiets += `${detail?.noteInfo}<br>`;
    });
    return chiTiets;
  }

  async openAddEditDialog(id: any) {
    this.closeModal();
    const config = {
      data: {id: id},
      width: '600px',
    };
    this.dialog.open(OutComingSupplierNoteAddEditDialogComponent, config);
  }

  async onPrint(printType: any) {

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
}
