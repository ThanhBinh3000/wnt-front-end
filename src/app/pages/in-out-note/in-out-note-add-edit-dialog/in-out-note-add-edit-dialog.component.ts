import {Component, Inject, Injector, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { PhieuThuChiService } from '../../../services/thuchi/phieu-thu-chi.service';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { NhaCungCapService } from '../../../services/categories/nha-cung-cap.service';
import { STATUS_API } from '../../../constants/message';
import { DatePipe } from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LOAI_THU_CHI} from "../../../constants/config";

@Component({
  selector: 'in-out-note-add-edit-dialog',
  templateUrl: './in-out-note-add-edit-dialog.component.html',
  styleUrls: ['./in-out-note-add-edit-dialog.component.css'],
})
export class InOutNoteAddEditDialogComponent extends BaseComponent implements OnInit {
  showMoreForm: boolean = false;
  expandLabel: string = '[+]';
  listObject : any[] = [];
  listPhieuNo : any[] = [];
  datePipe: any = new DatePipe('en-US');
  noteNumber: number = 0;
  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuThuChiService,
    private khachHangService: KhachHangService,
    private nhaCungCapService : NhaCungCapService,
    public dialogRef: MatDialogRef<InOutNoteAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      khachHangMaKhachHang : [''],
      phieuXuat : [-1],
      tienThanhToan : [0]
    });
  }

  async ngOnInit() {

  }

  isCreateView() {
    return !this.data.id;
  }

  isUpdateView() {
    return this.data.id;
  }

  getTitle() {
    let title = '';

    return this.data.loaiPhieu == 1 ? 'Phiếu Thu' : 'Phiếu Chi';
  }

  getReturnTitle() {
    let title = "Phiếu chi trả lại khách hàng";
    if ([LOAI_THU_CHI.CHI_TRA_NO_NHA_CUNG_CAP, LOAI_THU_CHI.THU_LAI_NHA_CUNG_CAP].includes(this.data.loaiPhieu)) {
      title = "Phiếu thu lại nhà cung cấp";
    }
    return title;
  }

  expandForm() {
    this.showMoreForm = !this.showMoreForm;
    this.expandLabel = this.showMoreForm ? '[-]' : '[+]';
  };

  async onGetNoteDebt(){
    let id = this.formData.get('khachHangMaKhachHang')?.value;
    if(!id) return;
    let body = { khachHangMaKhachHang : id, maLoaiXuatNhap : 2};
    this._service.searchListPhieuXuat(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listPhieuNo = res.data;

        this.listPhieuNo = this.listPhieuNo
                         .filter(x => x.tongTien - x.daTra - x.paymentScoreAmount - x.discount - x.debtPaymentAmount > 0);
        this.listPhieuNo.forEach(x=>{
             x.tieuDe = this.datePipe.transform(x.ngayXuat, 'MM/dd/yyyy') + " - " + x.soPhieuXuat;
        });
        this.listPhieuNo.unshift({id: -1, tieuDe : 'Tất cả'});
        let tienNo = this.listPhieuNo.filter(x=>x.id > 0)
        .reduce((acc, x) => acc += x.tongTien - x.daTra - x.paymentScoreAmount - x.discount - x.debtPaymentAmount, 0);
        this.formData.controls['tienNo'].setValue(tienNo);
        this.formData.controls['tienThanhToan'].setValue(tienNo);
        this.formData.controls['phieuXuat'].setValue(-1);
      }
    });
  }
  async onPayFull(){
    this.formData.controls['tienThanhToan'].setValue(this.formData.get('tienNo')?.value);
  }
  //tao so phieu moi nhat
  async genNoteNumber(type: Number){
    let body = { loaiPhieu : type};
    this._service.getMaxNoteNumber(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.noteNumber = res.data;
      }
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
