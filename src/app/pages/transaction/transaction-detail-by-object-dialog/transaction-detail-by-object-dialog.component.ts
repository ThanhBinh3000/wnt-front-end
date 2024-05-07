import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { PhieuXuatChiTietService } from '../../../services/inventory/phieu-xuat-chi-tiet.service';
import { CustomerAddEditDialogComponent } from '../../customer/customer-add-edit-dialog/customer-add-edit-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SETTING } from '../../../constants/setting';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap } from 'rxjs';
import { NhaThuocsService } from '../../../services/system/nha-thuocs.service';
import { STATUS_API } from '../../../constants/message';
import { LOAI_SAN_PHAM } from '../../../constants/config';
import { ThuocService } from '../../../services/products/thuoc.service';
import { NhomThuocService } from '../../../services/products/nhom-thuoc.service';

@Component({
  selector: 'transaction-detail-by-object-dialog',
  templateUrl: './transaction-detail-by-object-dialog.component.html',
  styleUrls: ['./transaction-detail-by-object-dialog.component.css'],
})
export class TransactionDetailByObjectDialogComponent extends BaseComponent implements OnInit {

  listNhaThuoc: any[] = [];
  listNhomThuoc: any[] = [];
  listLoais: any[] = [{
    id: 0 , name: 'Tất cả'
  },
  {
    id: 1 , name: 'Theo nhóm'
  },
  {
    id: 2 , name: 'Theo tên'
  }];
  listThuoc$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  objectName : String = "";

  useCustomerCommon = this.authService.getSettingByKey(SETTING.USE_CUSTOMER_COMMON);

  displayedColumns = [
    'stt',
    'soPhieu',
    'ngay',
    'tienNo',
    'vat',
    'matHang',
    'donVi',
    'soLuong',
    'donGia',
    'ck',
    'thanhTien',
    'action'
  ];

  constructor(
    injector: Injector,
    private phieuXuatChiTietService: PhieuXuatChiTietService,
    private nhaThuocsService : NhaThuocsService,
    private thuocsService : ThuocService,
    private nhomThuocService: NhomThuocService,
    public dialogRef: MatDialogRef<TransactionDetailByObjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public object: any
  ) {
    super(injector, phieuXuatChiTietService);
    this.formData = this.fb.group({
      dataDelete: [false],
      nhaThuocMaNhaThuoc: this.authService.getNhaThuoc().maNhaThuoc,
      khachHangMaKhachHang: object.id,
      loai : [0],
      thuocThuocIds : [],
      nhomThuocMaNhomThuoc: [0]
    });
  }
   
  async ngOnInit() {
    this.objectName = this.object.type == 'xuất' ? 'Khách hàng' : 'Nhà cung cấp'
    await this.searchPage();
    console.log(this.dataTable);
    this.getDataFilter();
  }

  getMaNhaThuocCha(){
    var maNhaThuocCha = this.authService.getNhaThuoc().maNhaThuocCha;
    return maNhaThuocCha ? maNhaThuocCha : this.authService.getNhaThuoc().maNhaThuoc;
  }

  getMaNhaThuoc(){
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getDataFilter() {
    // Danh sách nhà thuốc quản lý
    if(this.useCustomerCommon.activated){
      this.nhaThuocsService.searchList({
        maNhaThuocCha: this.getMaNhaThuocCha(),
        isConnectivity: false,
        hoatDong: true
      }).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          this.listNhaThuoc = res.data;
          if(!this.listNhaThuoc.some((i: any) => i.maNhaThuoc == this.getMaNhaThuoc())) {
            this.listNhaThuoc.unshift(this.authService.getNhaThuoc());
          }
        }
      });
    }
    // Danh sách nhóm thuốc
    let body = { dataDelete: false, maNhaThuoc: this.getMaNhaThuoc() };
    this.nhomThuocService.searchList(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhomThuoc = res.data;
      }
    });
    // Search thuốc
    this.listThuoc$ = this.searchThuocTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if(term.length >= 2){
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            nhaThuocMaNhaThuoc: this.formData.get('maNhaThuoc')?.value,
            typeService: LOAI_SAN_PHAM.THUOC
          };
          return from(this.thuocsService.searchPage(body).then((res) => {
            if (res?.status == STATUS_API.SUCCESS) {
              return res.data.content;
            }
          }));
        } else {
          return of([]);
        }
      }),
      catchError(() => of([]))
    );
  }

  closeModal() {
    this.dialogRef.close();
  }
}
