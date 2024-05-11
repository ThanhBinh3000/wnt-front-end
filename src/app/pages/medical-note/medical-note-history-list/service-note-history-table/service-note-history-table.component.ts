import {AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../../component/base/base.component";
import { RECORD_STATUS } from '../../../../constants/config';
import {SETTING} from "../../../../constants/setting";
import {MatSort} from "@angular/material/sort";
import {PhieuDichVuService} from "../../../../services/medical/phieu-dich-vu.service";
import {FormGroup} from "@angular/forms";
import {calculateAge} from "../../../../utils/date.utils";
import {CustomerDetailDialogComponent} from "../../../customer/customer-detail-dialog/customer-detail-dialog.component";

@Component({
  selector: 'service-note-history-table',
  templateUrl: './service-note-history-table.component.html',
  styleUrls: ['./service-note-history-table.component.css'],
})
export class ServiceNoteHistoryTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() override formData: FormGroup = this.fb.group({});
  @Input() formDataChange!: EventEmitter<any>;
  displayedColumns = ['checkBox', 'stt', 'noteNumber', 'noteDate', 'customerName', 'doctorName'];
  // Settings
  disableTimeClinic = this.authService.getSettingByKey(SETTING.DISABLE_TIME_CLINIC);

  // Authorities

  constructor(
    injector: Injector,
    private _service : PhieuDichVuService,
  ) {
    super(injector,_service);
  }

  ngOnInit() {
    this.formDataChange.subscribe((newValue) => {
      this.formData = this.fb.group({
        ...newValue,
        idCus: newValue.idPatient,
        fromDateCreated: newValue.fromDateNote ?? newValue.fromDateReExamination,
        toDateCreated: newValue.toDateNote ?? newValue.toDateReExamination,
      });
      this.formData.removeControl('fromDateNote');
      this.formData.removeControl('toDateNote');
      this.formData.removeControl('fromDateReExamination');
      this.formData.removeControl('toDateReExamination');
    });
  }

  @ViewChild(MatSort) sort?: MatSort;

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  getDisplayedColumns() {
    return this.displayedColumns;
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
  protected readonly RECORD_STATUS = RECORD_STATUS;
}
