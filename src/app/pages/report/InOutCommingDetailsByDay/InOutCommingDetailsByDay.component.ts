import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {BaseComponent} from "../../../component/base/base.component";
import {DatePipe} from "@angular/common";

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid
} from "ng-apexcharts";
import {ReportDetailsBydayService} from "../../../services/report/Report-Details-Byday.service";
import {ReportService} from "../../../services/report/report.service";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'InOutCommingDetailsByDay',
  templateUrl: './InOutCommingDetailsByDay.component.html',
  styleUrls: ['./InOutCommingDetailsByDay.component.css'],
})
export class InOutCommingDetailsByDayComponent extends BaseComponent implements OnInit {
  title: string = "Báo cáo thu-chi hằng ngày";
  filterTransactionType: any = 1;
  @ViewChild("chart") chart?: ChartComponent;
  public chartOptions: Partial<ChartOptions> | any;

  constructor(
    injector: Injector,
    private titleService: Title,
    private datePipe: DatePipe,
    private _service: ReportService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      drugStoreId: [ this.authService.getNhaThuoc().maNhaThuoc],
      reportFromDate: [],
      reportToDate: [],
    });
    this.chartOptions = {
      title: {
        text: "Tháng 05/2024",
        align: "left"
      },
      series: [
        {
          name: "Thu",
          data: [10, 20, 30, 40, 50, 10, 60, 70, 30, 80, 90, 100, 110, 120, 130],
          color: "#008000"
        },
        {
          name: "chi",
          data: [5, 25, 25, 45, 40, 8, 55, 75, 20, 11, 17, 150, 200, 111, 40],
          color: "#FF0000"
        }
      ],
      chart: {
        height: 700,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      markers: {
        size: 6,
        hover: {
          size: 10
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
        ]
      }
    };
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataReport();
    // this.calculatorTable();
  }


  getDataReport(){
    let body = this.formData.value;
    this._service.getInOutcommingDetailsByDayData(body).then(res=>{
      console.log(res);
      if(res?.data){
        const data = res.data;
        this.dataDetail = data
        this.dataTable = data.listDetail;
      }
    })
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

  showChart: boolean = false;

  toggleChart() {
    this.showChart = !this.showChart;
  }

  closeChart() {
    this.showChart = false;
  }
}
