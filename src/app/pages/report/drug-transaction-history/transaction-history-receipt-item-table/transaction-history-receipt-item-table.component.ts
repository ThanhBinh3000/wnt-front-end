import { AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../component/base/base.component';
import { FormGroup } from '@angular/forms';
import { PhieuNhapChiTietService } from '../../../../services/inventory/phieu-nhap-chi-tiet.service';
import { MatSort } from '@angular/material/sort';
import { LOAI_PHIEU, RECORD_STATUS } from '../../../../constants/config';
import { DrugDetailDialogComponent } from '../../../drug/drug-detail-dialog/drug-detail-dialog.component';

@Component({
  selector: 'transaction-history-receipt-item-table',
  templateUrl: './transaction-history-receipt-item-table.component.html',
  styleUrl: './transaction-history-receipt-item-table.component.css'
})
export class TransactionHistoryReceiptItemTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() override formData: FormGroup = this.fb.group({});
  @Input() formDataChange!: EventEmitter<any>;
  displayedColumns = ['stt', 
  'ngay', 
  'soPhieu', 
  'nhaCungCap', 
  'loaiPhieu', 
  'tenThuoc', 
  'donVi', 
  'soLuong', 
  'donGia',
  'c.k',
  'vat',
  'loHan',
  'sdk',
  'thanhTien'
];

  // Authorities

  constructor(
    injector: Injector,
    private _service : PhieuNhapChiTietService,
  ) {
    super(injector,_service);
  }

  async ngOnInit() {
    this.formDataChange.subscribe((newValue) => {
      this.formData = this.fb.group({
        ...newValue,
        fromDateNgayNhap: newValue.fromDate,
        toDateNgayNhap: newValue.toDate,
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

  getTenNCC(data :any){
    switch(data.maLoaiXuatNhap){
      case LOAI_PHIEU.PHIEU_NHAP :
        return data.nhaCungCapMaNhaCungCapText ? data.nhaCungCapMaNhaCungCapText : "Hàng nhập lẻ";
      case LOAI_PHIEU.PHIEU_NHAP_TU_KH :
        return data.khachHangMaKhachHangText ? data.khachHangMaKhachHangText : "Khách hàng lẻ";
      case LOAI_PHIEU.PHIEU_KIEM_KE :
        return "Điều chỉnh kiểm kê";
        default:
          return "";
    }
  }

  getTenLoaiPhieu(data :any){
    switch(data.maLoaiXuatNhap){
      case LOAI_PHIEU.PHIEU_NHAP :
        return "Nhập kho"
      case LOAI_PHIEU.PHIEU_NHAP_TU_KH :
        return "Khách hàng trả lại";
      case LOAI_PHIEU.PHIEU_KIEM_KE :
        return "Bù nhập";
      case LOAI_PHIEU.PHIEU_TON_BAN_DAU :
        return "Tồn đầu kỳ";
      default:
        return "";
    }
  }

  getUrlDetail(data : any){
    switch(data.maLoaiXuatNhap){
      case LOAI_PHIEU.PHIEU_NHAP :
      case LOAI_PHIEU.PHIEU_KIEM_KE :
        return `/management/note-management/receipt-note-detail/${data.phieuXuatMaPhieuXuat}`;
      case LOAI_PHIEU.PHIEU_NHAP_TU_KH :
        return `/management/note-management/return-from-customer-note-detail/${data.phieuXuatMaPhieuXuat}`;
      default:
        return "";
    }
  }

  getTotalNhap(){
    return this.dataTable.reduce((acc, val) => acc += (val.retailQuantity), 0);
  }

  openDetailDialog(drugId: any) {
    this.dialog.open(DrugDetailDialogComponent, {
      data: drugId,
      width: '600px',
    });
  }
}