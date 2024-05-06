import {AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../../component/base/base.component";
import {PhieuNhapService} from "../../../../services/inventory/phieu-nhap.service";
import { RECORD_STATUS } from '../../../../constants/config';
import {SETTING} from "../../../../constants/setting";
import {MatSort} from "@angular/material/sort";
import {MESSAGE, STATUS_API} from "../../../../constants/message";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'return-from-customer-note-table',
  templateUrl: './return-from-customer-note-table.component.html',
  styleUrls: ['./return-from-customer-note-table.component.css'],
})
export class ReturnFromCustomerNoteTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() override formData: FormGroup = this.fb.group({});
  @Input() formDataChange!: EventEmitter<any>;
  displayedColumns = ['checkBox', 'stt', 'soPhieuNhap', 'ngayNhap', 'tenNguoiTao', 'tenKhachHang', 'dienGiai', 'tongTien', 'action'];
  protected readonly RECORD_STATUS = RECORD_STATUS;
  // Settings
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
}
