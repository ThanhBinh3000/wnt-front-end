import {AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../../component/base/base.component";
import {RECORD_STATUS, TRANG_THAI_PHIEU_KHAM} from '../../../../constants/config';
import {SETTING} from "../../../../constants/setting";
import {MatSort} from "@angular/material/sort";
import {PhieuKhamService} from "../../../../services/medical/phieu-kham.service";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'wait-note-table',
  templateUrl: './wait-note-table.component.html',
  styleUrls: ['./wait-note-table.component.css'],
})
export class WaitNoteTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() override formData: FormGroup = this.fb.group({});
  @Input() formDataChange!: EventEmitter<any>;
  displayedColumns = ['checkBox', 'stt', 'created', 'createdByUseText', 'patientName', 'action'];
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
        statusNote: TRANG_THAI_PHIEU_KHAM.CHO_KHAM,
        storeCode: newValue.maNhaThuoc,
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
}
