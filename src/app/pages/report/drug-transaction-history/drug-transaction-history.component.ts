import { Component, EventEmitter, Inject, Injector, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap } from 'rxjs';
import { PhieuXuatChiTietService } from '../../../services/inventory/phieu-xuat-chi-tiet.service';
import { PhieuNhapChiTietService } from '../../../services/inventory/phieu-nhap-chi-tiet.service';
import { ThuocService } from '../../../services/products/thuoc.service';
import { TransactionDetailByObjectDialogComponent } from '../../transaction/transaction-detail-by-object-dialog/transaction-detail-by-object-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { STATUS_API } from '../../../constants/message';
import { DATE_RANGE, LOAI_PHIEU, LOAI_SAN_PHAM } from '../../../constants/config';
import { TransactionHistoryDeliveryItemTableComponent } from './transaction-history-delivery-item-table/transaction-history-delivery-item-table.component';
import { TransactionHistoryReceiptItemTableComponent } from './transaction-history-receipt-item-table/transaction-history-receipt-item-table.component';

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
  
  listNhaThuoc: any[] = [];
  listThuoc$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  checkTab: string = 'receipt';

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
      drugDefault : [{}],
      fromDateNgayXuat:[],
      toDateNgayXuat:[],
      fromDateNgayNhap:[],
      toDateNgayNhap:[],
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
      if(drugId > 0){
        this.formData.patchValue({
          thuocThuocId: drugId,
          thuocThuocIds: [drugId]
        });
        this.thuocsService.getDetail(drugId).then((res)=>{
          if(res?.status == STATUS_API.SUCCESS){
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

  override async searchPage() {
    this.formDataChange.emit(this.formData.value);
    await this.transactionHistoryDeliveryItemTableComponent?.searchPage();
    await this.transactionHistoryReceiptItemTableComponent?.searchPage();
    console.log(this.transactionHistoryReceiptItemTableComponent?.dataTable);
  }

  protected readonly DATE_RANGE = DATE_RANGE;

  getTotalInventory(){
    return this.transactionHistoryReceiptItemTableComponent?.getTotalNhap() - this.transactionHistoryDeliveryItemTableComponent?.getTotalXuat()
  }
}
