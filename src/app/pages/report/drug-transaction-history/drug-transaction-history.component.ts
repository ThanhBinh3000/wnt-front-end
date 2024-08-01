import {Component, EventEmitter, Inject, Injector, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {BaseComponent} from '../../../component/base/base.component';
import {Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap} from 'rxjs';
import {PhieuXuatChiTietService} from '../../../services/inventory/phieu-xuat-chi-tiet.service';
import {PhieuNhapChiTietService} from '../../../services/inventory/phieu-nhap-chi-tiet.service';
import {ThuocService} from '../../../services/products/thuoc.service';
import {MESSAGE, STATUS_API} from '../../../constants/message';
import {LOAI_SAN_PHAM} from '../../../constants/config';
import {
  TransactionHistoryDeliveryItemTableComponent
} from './transaction-history-delivery-item-table/transaction-history-delivery-item-table.component';
import {
  TransactionHistoryReceiptItemTableComponent
} from './transaction-history-receipt-item-table/transaction-history-receipt-item-table.component';
import printJS from "print-js";
import {saveAs} from 'file-saver';

@Component({
  selector: 'app-drug-transaction-history',
  templateUrl: './drug-transaction-history.component.html',
  styleUrl: './drug-transaction-history.component.css'
})
export class DrugTransactionHistoryComponent extends BaseComponent implements OnInit {
  [x: string]: any;

  title = "Tra cứu lịch sử giao dịch";
  @ViewChild(TransactionHistoryDeliveryItemTableComponent) transactionHistoryDeliveryItemTableComponent?: TransactionHistoryDeliveryItemTableComponent;
  @ViewChild(TransactionHistoryReceiptItemTableComponent) transactionHistoryReceiptItemTableComponent?: TransactionHistoryReceiptItemTableComponent;
  formDataChange = new EventEmitter();

  listThuoc$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  checkTab: string = 'receipt';
  listOfData: any[] | undefined = [];

  constructor(
    injector: Injector,
    private titleService: Title,
    private phieuXuatChiTietService: PhieuXuatChiTietService,
    private phieuNhapChiTietService: PhieuNhapChiTietService,
    private thuocsService: ThuocService,
  ) {
    super(injector, phieuXuatChiTietService);
    this.formData = this.fb.group({
      dataDelete: [false],
      nhaThuocMaNhaThuoc: this.authService.getNhaThuoc().maNhaThuoc,
      thuocThuocIds: [{}],
      soLo: [],
      hanDung: [],
      thuocThuocId: [],
      drugDefault: [{}],
      fromDateNgayXuat: [],
      toDateNgayXuat: [],
      fromDateNgayNhap: [],
      toDateNgayNhap: [],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();

  }

  async ngAfterViewInit() {
    this.route.queryParams.subscribe(params => {
      let drugId = Number(params['drugId']);
      console.log(drugId);
      if (drugId > 0) {
        this.formData.patchValue({
          thuocThuocId: drugId,
          thuocThuocIds: [drugId]
        });
        this.thuocsService.getDetail(drugId).then((res) => {
          if (res?.status == STATUS_API.SUCCESS) {
            this.formData.patchValue({
              drugDefault: res.data
            });
          }
        });
      }
    });
    this.searchPage();
  }

  getMaNhaThuocCha() {
    var maNhaThuocCha = this.authService.getNhaThuoc().maNhaThuocCha;
    return maNhaThuocCha ? maNhaThuocCha : this.authService.getNhaThuoc().maNhaThuoc;
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getDataFilter() {
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

  override async searchPage() {
    this.formDataChange.emit(this.formData.value);
    await this.transactionHistoryDeliveryItemTableComponent?.searchPage();
    await this.transactionHistoryReceiptItemTableComponent?.searchPage();
  }

  async print() {
    const isReceipt = this.checkTab === 'receipt';
    await this.dataPrintExcel(isReceipt);
    const service = isReceipt ? this.phieuNhapChiTietService : this.phieuXuatChiTietService;
    const res = await service.preview(this.listOfData)
    if (res?.data) {
      this.printSrc = res.data.pdfSrc;
      this.pdfSrc = this.PATH_PDF + res.data.pdfSrc;
      this.showDlgPreview = true;
      printJS({printable: this.printSrc, type: 'pdf', base64: true})
    } else {
      this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
    }
  }

  async dataPrintExcel(isReceipt: any) {
    const dataTableComponent = isReceipt
      ? this.transactionHistoryReceiptItemTableComponent
      : this.transactionHistoryDeliveryItemTableComponent;
    const totalThanhTien = dataTableComponent?.dataTable?.reduce((total, item) => {
      const thanhTien = isReceipt ? item.giaNhap * item.soLuong : item.giaXuat * item.soLuong;
      return total + thanhTien;
    }, 0) || 0;
    this.listOfData = dataTableComponent?.dataTable?.map(item => ({
      ...item,
      fromDateTu: this.formData.value.fromDate,
      fromDateDen: this.formData.value.toDate,
      fromDate: isReceipt ? item.ngayNhap : item.ngayXuat,
      totalThanhTien: totalThanhTien,
      totalAmount: totalThanhTien,
    }));
  }

  async exportData(fileName: string) {
    const isReceipt = this.checkTab === 'receipt';
    await this.dataPrintExcel(isReceipt);
    const service = isReceipt ? this.phieuNhapChiTietService : this.phieuXuatChiTietService;
    if (this.listOfData && this.listOfData.length > 0) {
      service.export(this.formData.value).subscribe((blob) =>
        saveAs(blob, fileName),
      );
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  getTotalInventory() {
    return this.transactionHistoryReceiptItemTableComponent?.getTotalNhap() - this.transactionHistoryDeliveryItemTableComponent?.getTotalXuat()
  }
}
