import {AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../../component/base/base.component";
import {PhieuNhapService} from "../../../../services/thuchi/phieu-nhap.service";
import {MatSort} from "@angular/material/sort";
import {RECORD_STATUS, TRANG_THAI_DONG_BO} from '../../../../constants/config';
import {SETTING} from "../../../../constants/setting";
import {PhieuXuatService} from "../../../../services/inventory/phieu-xuat.service";
import {MESSAGE, STATUS_API} from "../../../../constants/message";

@Component({
  selector: 'delivery-note-table',
  templateUrl: './delivery-note-table.component.html',
  styleUrls: ['./delivery-note-table.component.css'],
})
export class DeliveryNoteTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() override formData = this.fb.group({});
  @Input() formDataChange!: EventEmitter<any>;
  displayedColumns = ['checkBox', 'stt', 'soPhieuXuat', 'ngayXuat', 'nhanVien', 'khachHang', 'dienGiai', 'tongTien', 'action'];
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
    if (item.SynStatusId == TRANG_THAI_DONG_BO.SYNCHRONIZED) return '#00B8C7';
    if (item.SynStatusId == TRANG_THAI_DONG_BO.FAILED) return '#FC0F0F';
    if (item.SynStatusId == TRANG_THAI_DONG_BO.NOT_SYNC) return '#C98209';
    return '';
  }

  async onDelete(item: any){
    this.delete('Bạn có chắc là muốn xóa phiếu này?', item);
  }

  async onLockNote(item: any){
    const res = item.locked ? await this._service.unlock(item) : await this._service.lock(item);
    if (res && res.statusCode == STATUS_API.SUCCESS) {
      item.locked = res.data.locked;
      this.notification.success(MESSAGE.SUCCESS, item.locked ? "Phiếu đã được khóa" : "Phiếu đã được mở");
    }
  }

  async onRestore(item: any){

  }

  async onDeleteForever(item: any){

  }

  async onApprove(item: any){

  }

  async onCancel(item: any){

  }
}
