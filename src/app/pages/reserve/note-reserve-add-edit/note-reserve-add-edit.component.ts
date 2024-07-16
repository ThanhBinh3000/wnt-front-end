import {Component, HostListener, Injector, Input, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {BaseComponent} from '../../../component/base/base.component';
import {PhieuDuTruService} from '../../../services/products/phieu-du-tru.service';
import {Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap} from 'rxjs';
import {LOAI_PHIEU, LOAI_SAN_PHAM} from '../../../constants/config';
import {MESSAGE, STATUS_API} from '../../../constants/message';
import {ThuocService} from '../../../services/products/thuoc.service';
import {NhaCungCapService} from '../../../services/categories/nha-cung-cap.service';
import {NhomThuocService} from '../../../services/products/nhom-thuoc.service';
import {KhachHangService} from '../../../services/customer/khach-hang.service';
import {SETTING} from '../../../constants/setting';
import {DrugDetailDialogComponent} from '../../drug/drug-detail-dialog/drug-detail-dialog.component';
import _ from 'lodash';
import printJS from "print-js";
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-note-reserve-add-edit',
  templateUrl: './note-reserve-add-edit.component.html',
  styleUrl: './note-reserve-add-edit.component.css'
})
export class NoteReserveAddEditComponent extends BaseComponent implements OnInit {
  title: string = "Lập dự trù";
  listNhomThuoc: any[] = [];
  listThuoc$ = new Observable<any[]>;
  listNCC$ = new Observable<any[]>;
  listKhachHang$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  searchNCCTerm$ = new Subject<string>();
  searchKhachHangTerm$ = new Subject<string>();

  searchTypes = [
    {name: "Tất cả", value: 0},
    {name: "Theo nhà cung cấp", value: 1},
    {name: "Nhóm thuốc", value: 2},
    {name: "Tên thuốc", value: 3},
  ]

  // Quyền
  permittedFields: any = {
    drug_ViewInputPrice: true
  };

  // Settings
  enableCustomerToSupplier = this.authService.getSettingByKey(SETTING.ENABLE_CUSTOMER_TO_SUPPLIER).activated;
  useCustomerCommon = this.authService.getSettingByKey(SETTING.USE_CUSTOMER_COMMON).activated;
  enableViewAllStore = this.authService.getSettingByKey(SETTING.VIEW_MULTIPLE_WAREHOUSES_FROM_REPORTS).activated
    || this.authService.getSettingByKey(SETTING.ENABLE_VIEW_STOCK_ESTIMATES_FROM_WAREHOUSES).activated;

  displayedColumns = this.getDisplayedColumns();

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
      id: [],
      tongTien: [0],
      soPhieu: [],
      ngayTao: [],
      //filter
      searchType: [0],
      checkOutStock: [false],
      maNhaCungCap: [''],
      maNhomThuoc: [''],
      thuocId: [''],
      loaiIn: [''],
    });
  }

  getDisplayedColumns() {
    var val = ['#', 'maThuoc', 'tenThuoc', 'tenNhom', 'nhaCungCap', 'donViTon', 'soLuongCanhBao', 'tonKhoTong', 'tonKho', 'duTru', 'donViDuTru', 'donGia', 'thanhTien', 'action'];
    if (this.idUrl > 0) {
      val = val.filter(e => e !== 'nhaCungCap');
    }
    if (!this.enableViewAllStore) {
      val = val.filter(e => e !== 'tonKhoTong');
    }
    return val;
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
  }

  async ngAfterViewInit() {
    this.getId();
    if (this.idUrl) {
      let data = await this.detail(this.idUrl)
      this.formData.patchValue(data);
      this.dataTable = data.chiTiets;
    }
  }

  getDataFilter() {
    // Danh sách nhóm thuốc
    let body = {
      maNhaThuoc: this.getMaNhaThuocCha() != '' && this.getMaNhaThuocCha() != null ? this.getMaNhaThuocCha() : this.getMaNhaThuoc(),
      paggingReq: {limit: 1000, page: 0},
    };
    this.nhomThuocService.searchPage(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhomThuoc = res.data.content;
      }
    });
    // Search thuốc
    this.listThuoc$ = this.searchThuocTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            textSearch: term,
            paggingReq: {limit: 25, page: 0},
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
        if (term.length >= 2) {
          let body = {
            textSearch: term,
            paggingReq: {limit: 25, page: 0},
            dataDelete: false,
            maNhaThuoc: this.getMaNhaThuoc(),
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
    // Search khách hàng
    this.listKhachHang$ = this.searchKhachHangTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            textSearch: term,
            paggingReq: {limit: 25, page: 0},
            dataDelete: false,
            maNhaThuoc: this.useCustomerCommon ? this.getMaNhaThuocCha() : this.getMaNhaThuoc(),
          };
          return from(this.khachHangService.searchPage(body).then((res) => {
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

  async addItemReserve() {
    switch (this.formData.value?.searchType) {
      case 1:
        if (this.formData.value?.maNhaCungCap == "") {
          this.notification.error(MESSAGE.ERROR, 'Chọn 1 nhà cung cấp.');
          return;
        } else {
        }
        break;
      case 2:
        if (this.formData.value?.maNhomThuoc == "") {
          this.notification.error(MESSAGE.ERROR, 'Chọn 1 nhóm sản phẩm.');
          return;
        }
        break;
      case 3:
        if (this.formData.value?.thuocId == "") {
          this.notification.error(MESSAGE.ERROR, 'Chọn 1 sản phẩm.');
          return;
        }
        break;
    }
    let body = {
      nhaThuocMaNhaThuoc: this.getMaNhaThuocCha() != '' && this.getMaNhaThuocCha() != null ? this.getMaNhaThuocCha() : this.getMaNhaThuoc(),
      id: this.formData.value?.thuocId,
      nhomThuocMaNhomThuoc: this.formData.value?.maNhomThuoc,
      nhaCungCapMaNhaCungCap: this.formData.value?.maNhaCungCap,
      checkOutStock: this.formData.value?.checkOutStock,
      paggingReq: {limit: 1000, page: 0},
    };
    this.thuocsService.initCreateReserve(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        var data = res.data.content;
        var numItemAdd = 0;
        data.forEach((item: any) => {
          item.maThuocText = item.maThuoc;
          item.maThuoc = item.id;
          item.tenThuocText = item.tenThuoc;
          item.soLuongCanhBao = item.duTru;
          item.duTru = 0;
          item.maDonViTon = item.donViXuatLeMaDonViTinh;
          item.maDonViTonText = item.tenDonViTinhXuatLe;
          item.maDonViDuTru = item.donViThuNguyenMaDonViTinh > 0 ? item.donViThuNguyenMaDonViTinh : item.donViXuatLeMaDonViTinh;
          item.maDonViDuTruText = item.donViThuNguyenMaDonViTinh > 0 ? item.tenDonViTinhThuNguyen : item.tenDonViTinhXuatLe;
          item.donGia = item.heSo > 1 ? item.giaNhap * item.heSo : item.giaNhap;
          if (this.dataTable.filter(x => x.id == item.id).length == 0) {
            this.dataTable.push(item);
            numItemAdd++;
          }
        });
        this.notification.success(MESSAGE.SUCCESS, 'Đã thêm ' + numItemAdd + " thuốc vào danh sách.");
      }
    });
  }

  removeDrug(data: any) {
    var index = this.dataTable.indexOf(data);
    if (index >= 0) {
      this.dataTable.splice(index, 1);
    }
    this.updateTotal();
  }

  removeAllItem() {
    this.dataTable = [];
    this.formData.patchValue({tongTien: 0});
  }

  updateTotal() {
    this.formData.controls['tongTien'].setValue(this.dataTable.reduce((acc, val) => acc += (val.duTru * val.donGia), 0));
  }

  createUpdate() {
    if (this.dataTable.filter(x => x.duTru > 0).length == 0) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
      return;
    }
    let body = this.formData.value;
    body.chiTiets = this.dataTable.filter(x => x.duTru > 0);
    this.save(body).then(res => {
      if (res) {
        this.router.navigate(['/management/reserve/detail', res.id]);
      }
    });
  }

  async createUpdateNhaCC() {
    const validDataTable = this.dataTable.filter(x => x.duTru > 0);
    if (validDataTable.length === 0) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
      return;
    }
    const dataGroup = _.chain(validDataTable).groupBy('maNhaCungCap').map((value, key) => ({
      supplierId: key,
      tongTien: value.reduce((acc, val) => acc + (val.duTru * val.donGia), 0),
      chiTiets: value
    })).value();
    if (dataGroup) {
      this.markFormGroupTouched(dataGroup);
      const res = await this._service.createNhaCC(dataGroup);
      if (res?.status === STATUS_API.SUCCESS && res?.data) {
        if (res.data.length === 1) {
          this.router.navigate(['/management/reserve/detail', res.data[0].id]);
        } else {
          this.router.navigate(['/management/note-management/list'],
            {queryParams: {noteTypeId: LOAI_PHIEU.PHIEU_DU_TRU}});
        }
      }
    }
  }

  onGetDrugOutOfStock() {
    this.formData.patchValue({checkOutStock: true});
    this.addItemReserve();
    this.formData.patchValue({checkOutStock: false});
  }

  clearSearchTypeValue() {
    this.formData.patchValue({
      maNhaCungCap: '',
      maNhomThuoc: '',
      thuocId: ''
    });
  }

  openDetailDialog(drugId: any) {
    const dialogRef = this.dialog.open(DrugDetailDialogComponent, {
      data: drugId,
      width: '600px',
    });
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    switch (event.key) {
      case "F9":
        this.createUpdate();
        break;
      case "F1":
        let baseUrl = window.location.href.replace(this.router.url, '');
        const url = new URL("management/reserve/add", baseUrl).href;
        window.open(url, '_blank');
        break;
    }
  }

  async print(loaiIn?: any) {
    this.formData.patchValue({
      loaiIn: loaiIn
    })
    const body = {
      ...this.formData.value,
      chiTiets: this.dataTable
    };
    let res = await this._service.preview(body)
    if (res?.data) {
      this.printSrc = res.data.pdfSrc;
      this.pdfSrc = this.PATH_PDF + res.data.pdfSrc;
      this.showDlgPreview = true;
      printJS({printable: this.printSrc, type: 'pdf', base64: true})
    } else {
      this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
    }
  }

  exportData(fileName: string) {
    if (this.dataTable && this.dataTable.length > 0) {
      const body = {
        ...this.formData.value,
        chiTiets: this.dataTable
      };
      this.service.export(body).subscribe((blob) =>
        saveAs(blob, fileName),
      );
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }
}
