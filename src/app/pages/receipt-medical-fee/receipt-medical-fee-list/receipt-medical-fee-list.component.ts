import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {BaseComponent} from "../../../component/base/base.component";
import {MedicalFeeReceiptsService} from "../../../services/medical/medical-fee-receipts.service";
import {DATE_RANGE, RECORD_STATUS, TRANG_THAI_PHIEU_KHAM} from "../../../constants/config";
import {STATUS_API} from "../../../constants/message";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {KhachHangService} from "../../../services/customer/khach-hang.service";
import {MatSort} from "@angular/material/sort";
import {SETTING} from "../../../constants/setting";

@Component({
  selector: 'app-receipt-medical-fee',
  templateUrl: './receipt-medical-fee-list.component.html',
  styleUrls: ['./receipt-medical-fee-list.component.css'],
})
export class ReceiptMedicalFeeListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title: string = "Danh sách phiếu thu tiền khám bệnh";
  displayedColumns = ['stt', 'noteNumber', 'noteDate', 'customerName', 'debtAmount', 'discount', 'totalMoney', 'descriptNotePay', 'description', 'action'];
  listKhachHang$ = new Observable<any[]>;
  searchKhachHangTerm$ = new Subject<string>();
  // Settings
  disableTimeClinic = this.authService.getSettingByKey(SETTING.DISABLE_TIME_CLINIC);

  // Authorities
  receiptMedicalFeeCreateAndWrite = true;
  receiptMedicalFeePrint = true;
  receiptMedicalFeeDelete = true;

  constructor(
    injector: Injector,
    private _service: MedicalFeeReceiptsService,
    private khachHangService: KhachHangService,
    private titleService: Title
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      textSearch: [''],
      storeCode: [this.getMaNhaThuoc()],
      recordStatusId: [RECORD_STATUS.ACTIVE],
      idCus: [null],
      noteNumber: [null],
      customer: [null]
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
  }

  @ViewChild(MatSort) sort?: MatSort;
  async ngAfterViewInit() {
    this.route.queryParams.subscribe(async params => {
      const customerId = params['customerId'];
      if (customerId) {
        let res = await this.khachHangService.getDetail(customerId);
        if (res?.status == STATUS_API.SUCCESS){
          this.formData.patchValue({
            idPatient: res.data.id,
            customer: res.data
          });
        }
      }
      await this.searchPage();
      this.dataSource.sort = this.sort!;
    });
  }

  getDataFilter() {
    // Search khách hàng
    this.listKhachHang$ = this.searchKhachHangTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if(term.length >= 2){
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            maNhaThuoc: this.authService.getNhaThuoc()?.maNhaThuoc,
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

  onKhachHangSelectChange($event: any) {
    this.formData.patchValue({
      customer: $event
    })
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getTotalDebtAmount() {
    return this.dataSource.data.map((i: any) => i.debtAmount).reduce((acc, value) => acc + value, 0);
  }

  getTotalDiscount() {
    return this.dataSource.data.map((i: any) => i.discount).reduce((acc, value) => acc + value, 0);
  }

  getTotalAmount() {
    return this.dataSource.data.map((i: any) => i.totalMoney).reduce((acc, value) => acc + value, 0);
  }

  async onExport() {

  }

  async onPrint(printType: any) {

  }

  protected readonly DATE_RANGE = DATE_RANGE;
}
