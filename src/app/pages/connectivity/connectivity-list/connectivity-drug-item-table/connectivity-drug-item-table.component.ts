import { AfterViewInit, Component, EventEmitter, Injector, Input, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../../component/base/base.component';
import { FormGroup } from '@angular/forms';
import { PhieuNhapChiTietService } from '../../../../services/inventory/phieu-nhap-chi-tiet.service';
import { MatSort } from '@angular/material/sort';
import { LOAI_LIEN_THONG, LOAI_PHIEU, RECORD_STATUS, TRANG_THAI_LIEN_THONG } from '../../../../constants/config';
import { DrugDetailDialogComponent } from '../../../drug/drug-detail-dialog/drug-detail-dialog.component';
import { PhieuNhapService } from '../../../../services/inventory/phieu-nhap.service';
import { PhieuXuatService } from '../../../../services/inventory/phieu-xuat.service';
import { ConnectivityDrugService } from '../../../../services/products/connectivity-drug.service';

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
  'maThuocQuocGia'
  ];


  constructor(
    injector: Injector,
    private _service : ConnectivityDrugService,
  ) {
    super(injector,_service);
  }

  async ngOnInit() {
    this.formDataChange.subscribe((newValue) => {
      this.formData = this.fb.group({
        ...newValue,
        drugStoreId : this.authService.getNhaThuoc().maNhaThuoc
      });
    });
    console.log(this.dataSource);
  }

  protected readonly LOAI_LIEN_THONG = LOAI_LIEN_THONG;

  @ViewChild(MatSort) sort?: MatSort;

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  getDisplayedColumns() {
    return this.displayedColumns;
  }

  getTrangThaiLabel(data: any){
    let val = "Chưa LT";
       switch(data.connectivityStatusId){
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
    return item.connectivityStatusId != 2 ? '#F47DB0' : 'none';
  }
}