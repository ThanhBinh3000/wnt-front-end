import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { Title } from "@angular/platform-browser";
import { BaseComponent } from '../../component/base/base.component';
import { DonThuocQuocGiaService } from '../../services/inventory/don-thuoc-quoc-gia.service';
import { MESSAGE, STATUS_API } from '../../constants/message';
import { calculateAge } from '../../utils/date.utils';
import { NotificationModule } from '../notification/notification.module';
import { NotificationService } from '../../services/notification.service';
import { ChiTietDonDienTuDialogComponent } from './chi-tiet-don-dien-tu-dialog/chi-tiet-don-dien-tu-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-tra-cuu-don-thuoc-dien-tu',
  templateUrl: './tra-cuu-don-thuoc-dien-tu.component.html',
  styleUrls: ['./tra-cuu-don-thuoc-dien-tu.component.css'],
})
export class TraCuuDonThuocDienTuComponent implements OnInit, OnDestroy {
  title = 'Tra cứu đơn thuốc điện tử quốc gia';
  public formGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private renderer: Renderer2,
    private el: ElementRef,
    private authService: AuthService,
    private donThuocQuocGiaService: DonThuocQuocGiaService,
    private notification: NotificationService,
    private dialog: MatDialog
  ) {
    this.formGroup = this.fb.group({
      esampleNoteCode: []
    });
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.renderer.addClass(this.el.nativeElement.ownerDocument.body, 'login-bg');
  }

  ngOnDestroy() {
    this.renderer.removeClass(this.el.nativeElement.ownerDocument.body, 'login-bg');
  }

  getThongTinDonDienTu() {
    if (!this.formGroup.value?.esampleNoteCode) {
      this.notification.error(MESSAGE.ERROR, 'Vui lòng nhập mã đơn cần tra cứu.');
      return;
    }
    if (this.formGroup.value?.esampleNoteCode.length < 14) return;
    let body = {
      code: this.formGroup.get('esampleNoteCode')?.value,
      storeCode: this.authService.getNhaThuoc().maNhaThuoc
    }
    this.donThuocQuocGiaService.searchList(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        if (res.data.ngaySinhBenhNhan) {
          res.data.age = calculateAge(`${res.data.ngaySinhBenhNhan} 00:00:00`);
        }
        if(res.data.ngayTaiKham){
          res.data.ngayTaiKham = calculateAge(`${res.data.ngayTaiKham} 00:00:00`);
        }
        this.dialog.open(ChiTietDonDienTuDialogComponent, {
          data: res.data,
          width: '90%',
        });
      }
    });
  }
}
