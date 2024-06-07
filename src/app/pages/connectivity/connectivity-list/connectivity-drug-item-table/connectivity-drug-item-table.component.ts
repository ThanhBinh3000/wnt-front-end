import { AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../component/base/base.component';
import { FormGroup } from '@angular/forms';
import { PhieuNhapChiTietService } from '../../../../services/inventory/phieu-nhap-chi-tiet.service';
import { MatSort } from '@angular/material/sort';
import { LOAI_PHIEU, RECORD_STATUS, TRANG_THAI_LIEN_THONG } from '../../../../constants/config';
import { DrugDetailDialogComponent } from '../../../drug/drug-detail-dialog/drug-detail-dialog.component';
import { PhieuNhapService } from '../../../../services/inventory/phieu-nhap.service';
import { PhieuXuatService } from '../../../../services/inventory/phieu-xuat.service';

@Component({
  selector: 'connectivity-drug-item-table',
  templateUrl: './connectivity-drug-item-table.component.html',
  styleUrl: './connectivity-drug-item-table.component.css'
})
export class ConnectivityDrugItemTableComponent extends BaseComponent implements OnInit, AfterViewInit {
  @Input() override formData: FormGroup = this.fb.group({});
  @Input() formDataChange!: EventEmitter<any>;
  displayedColumns = ['stt', 
  'ma', 
  'ten', 
  'sdk', 
  'trangThai', 
  'ngayLT',
  'ketQuaLT', 
  'maThuocQuocGia',
  'action'
  ];


  constructor(
    injector: Injector,
    private _service : PhieuXuatService,
  ) {
    super(injector,_service);
  }

  async ngOnInit() {
    this.formDataChange.subscribe((newValue) => {
      this.formData = this.fb.group({
        ...newValue,
        fromDateCreated: newValue.fromDate,
        toDateCreated: newValue.toDate,
        maLoaiXuatNhaps : [[LOAI_PHIEU.PHIEU_XUAT, 
          LOAI_PHIEU.PHIEU_TRA_LAI_NCC, 
          LOAI_PHIEU.PHIEU_KIEM_KE,
          LOAI_PHIEU.PHIEU_XUAT_HUY
        ]],
        soPhieuXuat: newValue.soPhieu
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

  getTotalNhap(){
    return this.dataTable.reduce((acc, val) => acc += (val.retailQuantity), 0);
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
        case TRANG_THAI_LIEN_THONG.THUOC_CHUA_THIET_LAP_LT :
          val = "Thuốc chưa được thiết lập LT";
          break;
       }
       return val;
  }

  getRowColor(item : any){
    return item.connectivityStatusID != 2 ? '#F47DB0' : 'none';
  }
}