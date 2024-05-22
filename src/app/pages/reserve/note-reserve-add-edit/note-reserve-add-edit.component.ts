import { Component, Injector, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { PhieuDuTruService } from '../../../services/products/phieu-du-tru.service';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap } from 'rxjs';
import { LOAI_SAN_PHAM } from '../../../constants/config';
import { STATUS_API } from '../../../constants/message';
import { ThuocService } from '../../../services/products/thuoc.service';
import { NhaCungCapService } from '../../../services/categories/nha-cung-cap.service';
import { NhomThuocService } from '../../../services/products/nhom-thuoc.service';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { SETTING } from '../../../constants/setting';

@Component({
  selector: 'app-note-reserve-add-edit',
  templateUrl: './note-reserve-add-edit.component.html',
  styleUrl: './note-reserve-add-edit.component.css'
})
export class NoteReserveAddEditComponent extends BaseComponent implements OnInit {
  title: string = "Lập dự trù";
  listThuoc$ = new Observable<any[]>;
  listNCC$ = new Observable<any[]>;
  listKhachHang$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  searchNCCTerm$ = new Subject<string>();
  searchKhachHangTerm$ = new Subject<string>();

  searchTypes = [
    { name: "Tất cả", value: 0 },
    { name: "Theo nhà cung cấp", value: 1 },
    { name: "Nhóm thuốc", value: 2 },
    { name: "Tên thuốc", value: 3 },
  ]

  // Settings
  enableCustomerToSupplier = this.authService.getSettingByKey(SETTING.ENABLE_CUSTOMER_TO_SUPPLIER);

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuDuTruService,
    private nhomThuocService: NhomThuocService,
    private thuocsService: ThuocService,
    private nhaCungCapService: NhaCungCapService,
    private khachHangService: KhachHangService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: [''],
      searchType: [0],
      nhaCungCapMaNhaCungCap: [],
    });
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
  }

  getDataFilter() {
    // Danh sách nhóm thuốc

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
            nhaThuocMaNhaThuoc: this.getMaNhaThuocCha() != '' && this.getMaNhaThuocCha() != null ? this.getMaNhaThuocCha() : this.getMaNhaThuoc(),
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
    // Search nhà cung cấp
    this.listNCC$ = this.searchNCCTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if(term.length >= 2){
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            maNhaThuoc: this.formData.get('maNhaThuoc')?.value,
          };
          return from(this.nhaCungCapService.searchPage(body).then((res) => {
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

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getMaNhaThuocCha() {
    return this.authService.getNhaThuoc().maNhaThuocCha;
  }

  clearSearchTypeValue() {
    this.formData.patchValue({
      
    });
  }
}

