import {AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../../component/base/base.component";
import {MatSort} from "@angular/material/sort";
import {RECORD_STATUS, TRANG_THAI_PHIEU_KHAM} from '../../../../constants/config';
import {PhieuKhamService} from "../../../../services/medical/phieu-kham.service";
import {FormGroup} from "@angular/forms";
import {SETTING} from "../../../../constants/setting";
import {calculateAge, calculateDayFromDateRange} from "../../../../utils/date.utils";
import {CustomerDetailDialogComponent} from "../../../customer/customer-detail-dialog/customer-detail-dialog.component";

@Component({
  selector: 'medical-note-history-table',
  templateUrl: './medical-note-history-table.component.html',
  styleUrls: ['./medical-note-history-table.component.css'],
})
export class MedicalNoteHistoryTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() override formData: FormGroup = this.fb.group({});
  @Input() formDataChange!: EventEmitter<any>;
  displayedColumns = ['checkBox', 'stt', 'noteNumber', 'noteDate', 'patientName', 'doctorName', 'clinicalExamination', 'diagnostic', 'conclude', 'reexaminationDate'];
  // Settings
  disableTimeClinic = this.authService.getSettingByKey(SETTING.DISABLE_TIME_CLINIC);

  // Authorities
  noteMedicalRead = true;

  constructor(
    injector: Injector,
    private _service: PhieuKhamService,
  ) {
    super(injector, _service);
  }

  ngOnInit() {
    this.formDataChange.subscribe((newValue) => {
      this.formData = this.fb.group({
        ...newValue,
        statusNotes: [[TRANG_THAI_PHIEU_KHAM.DANG_KHAM, TRANG_THAI_PHIEU_KHAM.DA_KHAM]]
      });
    });
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  getDisplayedColumns() {
    return this.displayedColumns;
  }

  getDiagnostics(diagnostics: any) {
    return diagnostics?.map((item: any) => item.name).join('<br> ');
  }

  async openCustomerDetailDialog(item: any) {
    const dialogRef = this.dialog.open(CustomerDetailDialogComponent, {
      data: item.id,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
      }
    });
  }

  protected readonly calculateAge = calculateAge;
  protected readonly calculateDayFromDateRange = calculateDayFromDateRange;
  protected readonly RECORD_STATUS = RECORD_STATUS;
}
