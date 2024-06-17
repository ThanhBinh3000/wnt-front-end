import { AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../component/base/base.component';
import { FormGroup } from '@angular/forms';
import { PhieuNhapChiTietService } from '../../../../services/inventory/phieu-nhap-chi-tiet.service';
import { MatSort } from '@angular/material/sort';
import { LOAI_PHIEU, RECORD_STATUS, TRANG_THAI_LIEN_THONG } from '../../../../constants/config';
import { DrugDetailDialogComponent } from '../../../drug/drug-detail-dialog/drug-detail-dialog.component';
import { PhieuNhapService } from '../../../../services/inventory/phieu-nhap.service';
import { ConnectivityNoteGuideDialogComponent } from '../connectivity-note-guide-dialog/connectivity-note-guide-dialog.component';

@Component({
  selector: 'connectivity-receipt-item-table',
  templateUrl: './connectivity-receipt-item-table.component.html',
  styleUrl: './connectivity-receipt-item-table.component.css'
})
export class ConnectivityReceiptItemTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() override formData: FormGroup = this.fb.group({});
  @Input() formDataChange!: EventEmitter<any>;
  displayedColumns = ['stt', 
  'ngay', 
  'soPhieu', 
  'trangThai', 
  'ngayLT', 
  'ketQuaLT', 
  'maPhieuQuocGia',
  'action'
  ];

  loaiXuatNhaps : number[] = [LOAI_PHIEU.PHIEU_NHAP, 
    LOAI_PHIEU.PHIEU_NHAP_TU_KH, 
    LOAI_PHIEU.PHIEU_KIEM_KE];
  constructor(
    injector: Injector,
    private _service : PhieuNhapService,
  ) {
    super(injector,_service);
  }

  async ngOnInit() {
    this.formDataChange.subscribe((newValue) => {
      this.formData = this.fb.group({
        ...newValue,
        fromDateCreated: newValue.fromDate,
        toDateCreated: newValue.toDate,
        maLoaiXuatNhaps : [this.loaiXuatNhaps],
        soPhieuNhap : newValue.soPhieu
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

  protected readonly RECORD_STATUS = RECORD_STATUS;

  getUrlDetail(data : any){
    switch(data.loaiXuatNhapMaLoaiXuatNhap){
      case LOAI_PHIEU.PHIEU_NHAP :
      case LOAI_PHIEU.PHIEU_KIEM_KE :
        return `/management/note-management/receipt-note-detail/${data.id}`;
      case LOAI_PHIEU.PHIEU_NHAP_TU_KH :
        return `/management/note-management/return-from-customer-note-detail/${data.id}`;
      default:
        return "";
    }
  }

  getTrangThaiLabel(data: any){
    let val = "Chưa LT";
       switch(data.connectivityStatusID){
        case TRANG_THAI_LIEN_THONG.KHONG_LT:
          val = "Không LT";
          break;
        case TRANG_THAI_LIEN_THONG.PHIEU_LE_THANH_CONG:
        case TRANG_THAI_LIEN_THONG.PHIEU_BUON_THANH_CONG:
          val = "Đã LT";
          break;
        case TRANG_THAI_LIEN_THONG.LOI:
          val = "LT lỗi";
          break;
        case TRANG_THAI_LIEN_THONG.THUOC_CHUA_THIET_LAP_LT:
          val = "Thuốc chưa được thiết lập LT";
          break;
       }
       return val;
  }

  getRowColor(item : any){
    return item.connectivityStatusID != 2 ? '#F47DB0' : 'none';
  }

  openDetailDialog(note: any, type : any) {
    note.maLoaiXuatNhap = note.loaiXuatNhapMaLoaiXuatNhap;
    note.typeLack = type;
    this.dialog.open(ConnectivityNoteGuideDialogComponent, {
      data: note,
      width: '90%',
    });
  }
}