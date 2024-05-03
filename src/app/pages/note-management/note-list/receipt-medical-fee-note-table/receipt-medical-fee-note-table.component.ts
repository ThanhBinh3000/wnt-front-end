import {AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, ViewChild} from '@angular/core';
import {BaseComponent} from "../../../../component/base/base.component";
import {PhieuNhapService} from "../../../../services/thuchi/phieu-nhap.service";
import { RECORD_STATUS } from '../../../../constants/config';
import {SETTING} from "../../../../constants/setting";
import {MatSort} from "@angular/material/sort";
import {PhieuThuTienService} from "../../../../services/medical/phieu-thu-tien.service";

@Component({
  selector: 'receipt-medical-fee-note-table',
  templateUrl: './receipt-medical-fee-note-table.component.html',
  styleUrls: ['./receipt-medical-fee-note-table.component.css'],
})
export class ReceiptMedicalFeeNoteTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() override formData = this.fb.group({});
  @Input() formDataChange!: EventEmitter<any>;
  displayedColumns = ['checkBox', 'stt', 'noteNumber', 'noteDate', 'benhNhan', 'dienGiai', 'totalMoney', 'action'];
  protected readonly RECORD_STATUS = RECORD_STATUS;
  // Settings
  // Authorities
  drugViewInputPrice = true;

  constructor(
    injector: Injector,
    private _service : PhieuThuTienService,
  ) {
    super(injector,_service);
  }

  ngOnInit() {
    this.formDataChange.subscribe((newValue) => {
      this.formData = this.fb.group({
        ...newValue,
        storeCode: newValue.maNhaThuoc
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
    return this.dataSource.data.map((i: any) => i.totalMoney).reduce((acc, value) => acc + value, 0);
  }

  async onDelete(item: any){

  }

  async onLockNote(item: any){

  }

  async onRestore(item: any){

  }

  async onDeleteForever(item: any){

  }
}
