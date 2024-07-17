import {Component, Injector, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {BaseComponent} from "../../../component/base/base.component";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {NhomThuocService} from "../../../services/products/nhom-thuoc.service";
import {ThuocService} from "../../../services/products/thuoc.service";
import printJS from "print-js";
import {
  DrugBarCodePrintingDialogComponent
} from "../drug-bar-cade-printing-dialog/drug-bar-code-printing-dialog.component";

@Component({
  selector: 'InMaVach',
  templateUrl: './drug-bar-code-printing.component.html',
  styleUrls: ['./drug-bar-code-printing.component.css'],
})
export class DrugBarCodePrintingComponent extends BaseComponent implements OnInit {
  title: string = "In mã vạch thuốc";
  idPhieu: number | null = null;
  loaiPhieu: number | null = null;
  idNhomThuoc: number | null = null;
  listNhomThuoc: any[] = [];
  displayedColumns = [
    'stt',
    'maThuoc',
    'tenThuoc',
    'donVi',
    'giaBan',
    'maVach',
    'slTem',
    'action',
  ];

  constructor(
    private titleService: Title,
    injector: Injector,
    private _service: ThuocService,
    private nhomThuocService: NhomThuocService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [],
      idNhomThuoc: [],
      loaiIn: [''],
      khongInTenNhaThuoc: [''],
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.route.queryParams.subscribe(params => {
      this.idPhieu = params['id'];
      this.loaiPhieu = params['loaiPhieu'];
    });
    this.formData.patchValue({
      loaiIn: 'TenGia',
      khongInTenNhaThuoc: false
    })
    await this.getDataFilter();
    await this.getDataTable();
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  async getDataFilter() {
    let body = {dataDelete: false, maNhaThuoc: this.getMaNhaThuoc()};
    this.nhomThuocService.searchList(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhomThuoc = res.data;
      }
    });
  }

  async getDataTable() {
    this._service.getDataBarcode({
      idPhieu: this.idPhieu,
      loaiPhieu: this.loaiPhieu,
      idNhomThuoc: this.idNhomThuoc,
    }).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.dataTable = res?.data;
      }
    })
  }

  async searchNhomThuoc() {
    this.idNhomThuoc = this.formData.value.idNhomThuoc
    await this.getDataTable()
  }

  async deleteRow(index: number) {
    this.dataTable.splice(index, 1);
  }

  async deleteData() {
    this.dataTable = [];
  }

  async print() {
    this.dataTable.forEach(item => {
      item.loaiIn = this.formData.value.loaiIn;
      item.khongInTenNhaThuoc = this.formData.value.khongInTenNhaThuoc;
      item.slTem = item.slTem ? item.slTem : 1;
    });
    let res = await this._service.preview(this.dataTable)
    if (res?.data) {
      this.printSrc = res.data.pdfSrc;
      this.pdfSrc = this.PATH_PDF + res.data.pdfSrc;
      this.showDlgPreview = true;
      printJS({printable: this.printSrc, type: 'pdf', base64: true})
    } else {
      this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
    }
  }

  async openAddEditDialog(type: any) {
    const width = (type === 'InHuongDan') ? '800px' : '600px';
    const dialogRef = this.dialog.open(DrugBarCodePrintingDialogComponent, {
      data: type,
      width: width,
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.getDataTable()
      }
    });
  }
}
