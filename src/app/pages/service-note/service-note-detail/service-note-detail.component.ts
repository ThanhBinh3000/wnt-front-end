import { Component, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { PhieuDichVuService } from '../../../services/medical/phieu-dich-vu.service';
import { MESSAGE, STATUS_API } from '../../../constants/message';

@Component({
  selector: 'app-service-note',
  templateUrl: './service-note-detail.component.html',
  styleUrls: ['./service-note-detail.component.css'],
})
export class ServiceNoteDetailComponent extends BaseComponent implements OnInit {
  title: string = "PHIẾU DỊCH VỤ";
  displayedColumns = ['#', 'ma', 'ten', 'soLuong', 'donGia', 'thanhTien', 'ketQua'];
  data: any = {};

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuDichVuService,
  ) {
    super(injector, _service);
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getId();
    if (this.idUrl) {
      let data = await this.detail(this.idUrl);
      console.log(data);
      this.data = data;
      this.dataTable = data.chiTiets;
    }
  }

  async onPayment() {
    const idCus = this.data.idCus;
    this.router.navigate(['/management/receipt-medical-fee/add'], { queryParams: { idCus: idCus } });
  }

  async onLockNote() {
    let locked = this.data.isLock;
    const res = locked ? await this._service.unlock({ id: this.data.id }) : await this._service.lock({ id: this.data.id });
    if (res && res.status == STATUS_API.SUCCESS) {
      this.data.isLock = res.data.isLock;
      this.notification.success(MESSAGE.SUCCESS, this.data.isLock ? "Phiếu đã được khóa" : "Phiếu đã được mở");
    }
  }
}
