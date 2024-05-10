import {AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../../component/base/base.component";
import {MatSort} from "@angular/material/sort";
import {RECORD_STATUS, TRANG_THAI_PHIEU_KHAM} from '../../../../constants/config';
import {PhieuKhamService} from "../../../../services/medical/phieu-kham.service";
import {STATUS_API} from "../../../../constants/message";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'medical-note-table',
  templateUrl: './medical-note-table.component.html',
  styleUrls: ['./medical-note-table.component.css'],
})
export class MedicalNoteTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() override formData: FormGroup = this.fb.group({});
  @Input() formDataChange!: EventEmitter<any>;
  displayedColumns = ['checkBox', 'stt', 'noteNumber', 'created', 'createdByUseText', 'patientName', 'doctorName', 'action'];
  protected readonly RECORD_STATUS = RECORD_STATUS;
  // Settings
  // Authorities

  constructor(
    injector: Injector,
    private _service : PhieuKhamService,
  ) {
    super(injector,_service);
  }

  ngOnInit() {
    this.formDataChange.subscribe((newValue) => {
      this.formData = this.fb.group({
        ...newValue,
        storeCode: newValue.maNhaThuoc,
        // statusNote: != TRANG_THAI_PHIEU_KHAM.CHO_KHAM,
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

  override async searchPage() {
    let body = this.formData.value
    body.paggingReq = {
      limit: this.pageSize,
      page: this.page - 1
    }
    let res = await this._service.searchPagePhieuKham(body);
    if (res?.status == STATUS_API.SUCCESS) {
      let data = res.data;
      this.dataTable = data.content;
      this.totalRecord = data.totalElements;
      this.totalPages = data.totalPages;
    } else {
      this.dataTable = [];
      this.totalRecord = 0;
    }
  }
}
