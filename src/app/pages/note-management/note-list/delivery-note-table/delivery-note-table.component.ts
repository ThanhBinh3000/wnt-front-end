import {AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../../component/base/base.component";
import {MatSort} from "@angular/material/sort";
import {RECORD_STATUS, TRANG_THAI_DONG_BO} from '../../../../constants/config';
import {SETTING} from "../../../../constants/setting";
import {PhieuXuatService} from "../../../../services/inventory/phieu-xuat.service";
import {MESSAGE, STATUS_API} from "../../../../constants/message";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'delivery-note-table',
  templateUrl: './delivery-note-table.component.html',
  styleUrls: ['./delivery-note-table.component.css'],
})
export class DeliveryNoteTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() override formData: FormGroup = this.fb.group({});
  @Input() formDataChange!: EventEmitter<any>;
  displayedColumns = ['checkBox', 'stt', 'soPhieuXuat', 'ngayXuat', 'createdByUserText', 'khachHangMaKhachHangText', 'dienGiai', 'tongTien', 'action'];
  protected readonly RECORD_STATUS = RECORD_STATUS;
  // Settings
  storeCodeForConnectivity = {
    activated:  this.authService.getSettingActivated(SETTING.STORE_CODE_FOR_CONNECTIVITY),
    value: this.authService.getSettingValue(SETTING.STORE_CODE_FOR_CONNECTIVITY)
  };
  storeCodeForManagement = {
    activated:  this.authService.getSettingActivated(SETTING.STORE_CODE_FOR_MANAGEMENT),
    value: this.authService.getSettingValue(SETTING.STORE_CODE_FOR_MANAGEMENT)
  };
  // Authorities
  drugViewInputPrice = true;
  deliveryNoteRestore = true;

  constructor(
    injector: Injector,
    private _service : PhieuXuatService,
  ) {
    super(injector,_service);
  }

  ngOnInit() {
    this.formDataChange.subscribe((newValue) => {
      this.formData = this.fb.group({
        ...newValue,
        nhaThuocMaNhaThuoc: newValue.maNhaThuoc,
        maLoaiXuatNhap: newValue.noteTypeId
      });
    });
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  getDisplayedColumns() {
    let columns = this.displayedColumns;
    if(this.formData.get('maNhaThuoc')?.value !== this.getMaNhaThuoc()) {
      columns = columns.filter((i: any) => i !== 'checkBox');
      columns = columns.filter((i: any) => i !== 'action');
    }
    return columns;
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  isSuperUser() {
    return this.authService.isSuperUser();
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  getTotalAmount() {
    return this.dataSource.data.map((i: any) => i.tongTien).reduce((acc, value) => acc + value, 0);
  }

  getSyncStatusColor(item: any) {
    if (item.synStatusId == TRANG_THAI_DONG_BO.SYNCHRONIZED) return '#00B8C7';
    if (item.synStatusId == TRANG_THAI_DONG_BO.FAILED) return '#FC0F0F';
    if (item.synStatusId == TRANG_THAI_DONG_BO.NOT_SYNC) return '#C98209';
    return '';
  }

  async onResetSyncMultiple() {
    let dataResetSync : any[] = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataResetSync.push(item.id);
        }
      });
    }
    if (dataResetSync && dataResetSync.length > 0) {
      this.modal.confirm({
        closable: false,
        title: 'Xác nhận',
        content: "Bạn thực sự muốn thiết lập lại trạng thái để đồng bộ lại?",
        okText: 'Đồng ý',
        cancelText: 'Không',
        okDanger: true,
        width: 310,
        onOk: async () => {
          let res = await this._service.resetSync({listIds: dataResetSync});
          if (res && res.data) {
            this.notification.success(MESSAGE.SUCCESS, "Đồng bộ hóa đơn thành công.");
            await this.searchPage();
          }
        },
      });
    } else {
      this.notification.error(MESSAGE.ERROR, "Chọn các phiếu muốn thiết lập trạng thái để đồng bộ lại.");
    }
  }

  async onExportMultipleInvoice() {
  }
}
