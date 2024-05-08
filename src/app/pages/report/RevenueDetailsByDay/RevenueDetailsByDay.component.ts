import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {BaseComponent} from "../../../component/base/base.component";
import {MatSort} from "@angular/material/sort";
import {ReportDetailsBydayService} from "../../../services/report/Report-Details-Byday.service";
import {DatePipe} from "@angular/common";
import {MESSAGE, STATUS_API} from "../../../constants/message";

@Component({
  selector: 'RevenueDetailsByDay',
  templateUrl: './RevenueDetailsByDay.component.html',
  styleUrls: ['./RevenueDetailsByDay.component.css'],
})
export class RevenueDetailsByDayComponent extends BaseComponent implements OnInit {
  title: string = "Báo cáo doanh thu chi tiết theo ngày";
  filterTransactionType: any = 1;
  optioncheck: any;

  constructor(
    injector: Injector,
    private titleService: Title,
    private datePipe: DatePipe,
    private _service: ReportDetailsBydayService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      nhaThuocMaNhaThuoc: [],
      ngayXuat: [],
      soPhieuXuat: [123],
      deliveryTotal: [],
      totalDiscount: [],
      totalPaymentScoreAmount: [],
      totalRevenue: [],
      totalDebtPaymentAmount: [],
      ngayXuatDen: [],
      ngayXuatTu: [],
      checkOption: []
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchDetailsByDay();
    await this.calculatorTable();
  }

  async searchDetailsByDay() {
    try {
      let body = this.formData.value
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this._service.DetailsByDay(body);
      if (res?.status == STATUS_API.SUCCESS) {
        let data = res.data;
        this.dataTable = data;
        this.totalRecord = data.totalElements;
        this.totalPages = data.totalPages;
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
    }
  }

  @ViewChild(MatSort) sort?: MatSort;


  onFilterTransactionTypeChange(filterTransactionType: number) {
    this.filterTransactionType = filterTransactionType;
    if (filterTransactionType == 1) {
      const fromDate = this.formData.get('ngayXuatTu')?.value;
      const toDate = this.formData.get('ngayXuatDen')?.value;
      const transactionFromDate = this.datePipe.transform(fromDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
      const transactionToDate = this.datePipe.transform(toDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
      this.formData.patchValue({
        transactionFromDate: transactionFromDate,
        transactionToDate: transactionToDate,
      })
    }
  }

  onTransactionFromDateChange(fromDate: Date) {
    const toDate = this.formData.get('ngayXuatDen')?.value;
    let formattedDate = '';
    if (toDate && fromDate > toDate) {
      this.formData.get('ngayXuatTu')?.setValue(toDate);
      formattedDate = this.datePipe.transform(toDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
    } else {
      formattedDate = this.datePipe.transform(fromDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
    }
    this.formData.patchValue({
      transactionFromDate: formattedDate
    });
  }

  onTransactionToDateChange(toDate: Date) {
    const fromDate = this.formData.get('ngayXuatTu')?.value;
    let formattedDate = '';
    if (fromDate && toDate < fromDate) {
      formattedDate = this.datePipe.transform(fromDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
    } else {
      formattedDate = this.datePipe.transform(toDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
    }
    this.formData.patchValue({
      transactionToDate: formattedDate
    });
  }

  async calculatorTable() {
    this.formData.patchValue({
      deliveryTotal: this.dataTable.reduce((prev, cur) => prev + cur.tongTien, 0),
      totalDiscount: this.dataTable.reduce((prev, cur) => prev + cur.discount, 0),
      totalPaymentScoreAmount: this.dataTable.reduce((prev, cur) => prev + cur.paymentScoreAmount, 0),
      totalRevenue: this.dataTable.reduce((prev, cur) => prev + cur.revenue, 0),
      totalDebtPaymentAmount: this.dataTable.reduce((prev, cur) => prev + cur.debtPaymentAmount, 0),
    })
  }

  handleSelectChange() {
    if (this.formData.value.checkOption === '1'){
      this.searchDetailsByDay()
    }
  }
}
