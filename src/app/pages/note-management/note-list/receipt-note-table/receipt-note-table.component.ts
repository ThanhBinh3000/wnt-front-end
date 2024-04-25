import {AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../../component/base/base.component";
import {PhieuNhapService} from "../../../../services/inventory/phieu-nhap.service";
import {MatSort} from "@angular/material/sort";
import {RECORD_STATUS} from "../../../../constants/config";
import {SETTING} from "../../../../constants/setting";

@Component({
  selector: 'receipt-note-table',
  templateUrl: './receipt-note-table.component.html',
  styleUrls: ['./receipt-note-table.component.css'],
})
export class ReceiptNoteTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() override formData = this.fb.group({});
  @Input() formDataChange!: EventEmitter<any>;
  displayedColumns = ['checkBox', 'stt', 'soPhieuNhap', 'ngayNhap', 'nhanVien', 'nhaCungCap', 'dienGiai', 'tongTien', 'action'];
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
  receiptNoteRestore = true;

  constructor(
    injector: Injector,
    private _service : PhieuNhapService,
  ) {
    super(injector,_service);
  }

  ngOnInit() {
    this.formDataChange.subscribe((newValue) => {
      this.formData = this.fb.group({
        ...newValue,
        nhaThuocMaNhaThuoc: newValue.maNhaThuoc,
        loaiXuatNhapMaLoaiXuatNhap: newValue.noteTypeId
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

  async onDelete(item: any){

  }

  async onLockNote(item: any){

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
