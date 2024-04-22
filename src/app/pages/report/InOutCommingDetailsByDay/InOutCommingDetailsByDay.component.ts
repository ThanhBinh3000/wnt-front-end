import {Component, Injector, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {BaseComponent} from "../../../component/base/base.component";
import {DatePipe} from "@angular/common";
import {InOutCommingDetailsByDayService} from "../../../services/report/InOut-Comming-Details-ByDay.service";


@Component({
  selector: 'InOutCommingDetailsByDay',
  templateUrl: './InOutCommingDetailsByDay.component.html',
  styleUrls: ['./InOutCommingDetailsByDay.component.css'],
})
export class InOutCommingDetailsByDayComponent extends BaseComponent implements OnInit {
  title: string = "Báo cáo thu-chi hằng ngày";
  filterTransactionType: any = 1;
  constructor(
    injector: Injector,
    private titleService: Title,
    private datePipe: DatePipe,
    private _service: InOutCommingDetailsByDayService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      nhaThuocMaNhaThuoc: [],
      // tongKhachNo: [374166],
      // tongThu: [],
      // tongChi: [],
      // thuTruChi: [],
      // pickerTransactionFromDate: [],
      // pickerTransactionToDate: [],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.formData.patchValue({
      nhaThuocMaNhaThuoc: this.authService.getNhaThuoc().maNhaThuoc,
    })
    // await this.searchList();
    this.dataTable = [
      {
        loai: 'Bán hàng',
        thuTienMat: 10488095,
        thuChuyenKhoan: 0,
        chiTienMat: 0,
        chiChuyenKhoan: 0,
        ghiChu: 'Tổng doanh số: 10,862,261'
      },
      {
        loai: 'Mua hàng',
        thuTienMat: 0,
        thuChuyenKhoan: 0,
        chiTienMat: 22076247,
        chiChuyenKhoan: 0,
        ghiChu: 'Tổng phí mua hàng: 22,076,247'
      },
      {
        loai: 'Thu nợ khách hàng',
        thuTienMat: 331000,
        thuChuyenKhoan: 38000,
        chiTienMat: 0,
        chiChuyenKhoan: 0,
        ghiChu: 'Đã thu nợ số khách hàng: 2'
      },
      {
        loai: 'Trả nợ nhà cung cấp',
        thuTienMat: 0,
        thuChuyenKhoan: 0,
        chiTienMat: 0,
        chiChuyenKhoan: 0,
        ghiChu: 'Đã trả nợ số nhà cung cấp: 0'
      },
      {
        loai: 'Khách hàng trả lại',
        thuTienMat: 0,
        thuChuyenKhoan: 0,
        chiTienMat: 41643,
        chiChuyenKhoan: 0,
        ghiChu: 'Số khách trả lại hàng: 2'
      },
      {
        loai: 'Trả lại nhà cung cấp',
        thuTienMat: 0,
        thuChuyenKhoan: 0,
        chiTienMat: 0,
        chiChuyenKhoan: 0,
        ghiChu: 'Trả lại hàng số nhà cung cấp: 0'
      },
      {
        loai: 'Thu khác',
        thuTienMat: 230000,
        thuChuyenKhoan: 0,
        chiTienMat: 0,
        chiChuyenKhoan: 0,
        ghiChu: ''
      },
      {
        loai: 'Chi khác',
        thuTienMat: 0,
        thuChuyenKhoan: 0,
        chiTienMat: 300000,
        chiChuyenKhoan: 0,
        ghiChu: ''
      },
      {
        loai: 'Chi phí kinh doanh',
        thuTienMat: 0,
        thuChuyenKhoan: 0,
        chiTienMat: 0,
        chiChuyenKhoan: 0,
        ghiChu: ''
      },
      {
        loai: 'Chi trả lại khách hàng',
        thuTienMat: 0,
        thuChuyenKhoan: 0,
        chiTienMat: 0,
        chiChuyenKhoan: 0,
        ghiChu: 'Chi trả lại cho số khách hàng: 0'
      },
      {
        loai: 'Thu lại nhà cung cấp',
        thuTienMat: 0,
        thuChuyenKhoan: 0,
        chiTienMat: 0,
        chiChuyenKhoan: 0,
        ghiChu: 'Chi trả lại cho số khách hàng: 0'
      },
    ]
    this.calculatorTable();
  }

  onFilterTransactionTypeChange(filterTransactionType: number) {
    this.filterTransactionType = filterTransactionType;
    if (filterTransactionType == 1) {
      const fromDate = this.formData.get('pickerTransactionFromDate')?.value;
      const toDate = this.formData.get('pickerTransactionToDate')?.value;
      const transactionFromDate = this.datePipe.transform(fromDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
      const transactionToDate = this.datePipe.transform(toDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
      this.formData.patchValue({
        transactionFromDate: transactionFromDate,
        transactionToDate: transactionToDate
      })
    }
  }

  onTransactionFromDateChange(fromDate: Date) {
    const toDate = this.formData.get('pickerTransactionToDate')?.value;
    let formattedDate = '';
    if (toDate && fromDate > toDate) {
      this.formData.get('pickerTransactionFromDate')?.setValue(toDate);
      formattedDate = this.datePipe.transform(toDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
    } else {
      formattedDate = this.datePipe.transform(fromDate, 'dd/MM/yyyy HH:mm:ss') ?? '';
    }
    this.formData.patchValue({
      transactionFromDate: formattedDate
    });
  }

  onTransactionToDateChange(toDate: Date) {
    const fromDate = this.formData.get('pickerTransactionFromDate')?.value;
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

  calcTong(columnName?) {
    if (this.dataTable) {
      return this.dataTable.reduce((sum, cur) => sum + (cur?.[columnName] || 0), 0);
    }
  }

  async calculatorTable() {
    const {thuTienMat, thuChuyenKhoan, chiTienMat, chiChuyenKhoan} = this.dataTable.reduce((acc, cur) => {
      acc.thuTienMat += cur.thuTienMat;
      acc.thuChuyenKhoan += cur.thuChuyenKhoan;
      acc.chiTienMat += cur.chiTienMat;
      acc.chiChuyenKhoan += cur.chiChuyenKhoan;
      return acc;
    }, {thuTienMat: 0, thuChuyenKhoan: 0, chiTienMat: 0, chiChuyenKhoan: 0});
    const tongThu = thuTienMat + thuChuyenKhoan;
    const tongChi = chiTienMat + chiChuyenKhoan;
    this.formData.patchValue({
      tongThu,
      tongChi,
      thuTruChi: tongThu - tongChi
    });
  }
}
