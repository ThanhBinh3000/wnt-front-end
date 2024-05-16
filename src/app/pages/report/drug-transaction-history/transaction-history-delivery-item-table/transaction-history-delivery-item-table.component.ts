import { AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../../component/base/base.component';
import { FormGroup } from '@angular/forms';
import { SETTING } from '../../../../constants/setting';
import { PhieuXuatChiTietService } from '../../../../services/inventory/phieu-xuat-chi-tiet.service';
import { MatSort } from '@angular/material/sort';
import { LOAI_PHIEU, RECORD_STATUS } from '../../../../constants/config';
import { DrugDetailDialogComponent } from '../../../drug/drug-detail-dialog/drug-detail-dialog.component';

@Component({
  selector: 'transaction-history-delivery-item-table',
  templateUrl: './transaction-history-delivery-item-table.component.html',
  styleUrl: './transaction-history-delivery-item-table.component.css'
})
export class TransactionHistoryDeliveryItemTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() override formData: FormGroup = this.fb.group({});
  @Input() formDataChange!: EventEmitter<any>;
  displayedColumns = ['stt', 
  'ngay', 
  'soPhieu', 
  'khachHang', 
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
    private _service : PhieuXuatChiTietService,
  ) {
    super(injector,_service);
  }

   async ngOnInit() {
    this.formDataChange.subscribe((newValue) => {
      this.formData = this.fb.group({
        ...newValue,
        fromDateNgayXuat: newValue.fromDate,
        toDateNgayXuat: newValue.toDate,
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
  
  getDataKhachHang(data :any){
    switch(data.maLoaiXuatNhap){
      case LOAI_PHIEU.PHIEU_XUAT :
      case LOAI_PHIEU.PHIEU_CHUYEN_KHO :
        return data.khachHangMaKhachHangText ? data.khachHangMaKhachHangText : "Khách hàng lẻ";
      case LOAI_PHIEU.PHIEU_TRA_LAI_NCC :
        return data.nhaCungCapMaNhaCungCapText ? data.nhaCungCapMaNhaCungCapText : "Hàng nhập lẻ";
      case LOAI_PHIEU.PHIEU_KIEM_KE :
        return "Điều chỉnh kiểm kê";
        default:
          return "";
    }
  }

  getDataLoaiPhieu(data :any){
    switch(data.maLoaiXuatNhap){
      case LOAI_PHIEU.PHIEU_XUAT :
        return "Xuất hàng"
      case LOAI_PHIEU.PHIEU_CHUYEN_KHO :
        return "Chuyển kho";
      case LOAI_PHIEU.PHIEU_TRA_LAI_NCC :
        return "Trả lại nhà cung cấp";
      case LOAI_PHIEU.PHIEU_KIEM_KE :
        return "Bù xuất";
      case LOAI_PHIEU.PHIEU_XUAT_HUY :
        return "Xuất huỷ";
      default:
        return "";
    }
  }

  getUrlDetail(data : any){
    switch(data.maLoaiXuatNhap){
      case LOAI_PHIEU.PHIEU_XUAT :
      case LOAI_PHIEU.PHIEU_KIEM_KE :
        return `/management/note-management/delivery-note-detail/${data.phieuXuatMaPhieuXuat}`;
      case LOAI_PHIEU.PHIEU_NHAP_TU_KH :
        return `/management/note-management/return-to-supplier-note-detail/${data.phieuXuatMaPhieuXuat}`;
        case LOAI_PHIEU.PHIEU_XUAT_HUY :
          return `/management/note-management/cancel-delivery-note-detail/${data.phieuXuatMaPhieuXuat}`;
      default:
        return "";
    }
  }

  protected readonly RECORD_STATUS = RECORD_STATUS;

  getTotalXuat(){
    return this.dataTable.reduce((acc, val) => acc += (val.retailQuantity), 0);
  }

  openDetailDialog(drugId: any) {
    this.dialog.open(DrugDetailDialogComponent, {
      data: drugId,
      width: '600px',
    });
  }
}
