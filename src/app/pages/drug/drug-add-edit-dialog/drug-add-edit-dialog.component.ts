import {Component, Inject, Injector, Input, OnInit, ViewChild} from '@angular/core';
import { STATUS_API } from "../../../constants/message";
import { BaseComponent } from "../../../component/base/base.component";
import { Title } from "@angular/platform-browser";
import { ThuocService } from "../../../services/products/thuoc.service";
import { NhomThuocService } from "../../../services/products/nhom-thuoc.service";
import { DonViTinhService } from "../../../services/products/don-vi-tinh.service";
import { WarehouseLocationService } from "../../../services/products/warehouse-location-service";
import { ProductTypesService } from "../../../services/products/product-types-service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {
  DrugGroupAddEditDialogComponent
} from "../../drug-group/drug-group-add-edit-dialog/drug-group-add-edit-dialog.component";
import { Validators } from '@angular/forms';
import { dateValidator } from '../../../validators/date.validator';
import { LOAI_SAN_PHAM } from '../../../constants/config';
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {NgSelectComponent} from "@ng-select/ng-select";

@Component({
  selector: 'drug-add-edit-dialog',
  templateUrl: './drug-add-edit-dialog.component.html',
  styleUrls: ['./drug-add-edit-dialog.component.css'],
})
export class DrugAddEditDialogComponent extends BaseComponent implements OnInit {
  @ViewChild('selectDrug') selectDrug!: NgSelectComponent;
  checkTab: string = 'main-information';
  listNhomThuoc: any[] = []
  listThuoc$ = new Observable<any[]>;
  drugDefault: any = {};
  searchThuocTerm$ = new Subject<string>();
  listDonViTinh: any[] = []
  listWarehouse: any[] = []
  listProductTypes: any[] = []
  dataThayThe: any[] = [];
  dataBanKem: any[] = [];



  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: ThuocService,
    private nhomThuocService: NhomThuocService,
    private donViTinhService: DonViTinhService,
    private thuocService : ThuocService,
    private warehouseLocationService: WarehouseLocationService,
    private productTypesService: ProductTypesService,
    public dialogRef: MatDialogRef<DrugAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public drugId: any
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [],
      idWarehouseLocation: [0],
      nhomThuocMaNhomThuoc: [0, [Validators.required, Validators.min(1)]],
      donViXuatLeMaDonViTinh: [0, [Validators.required, Validators.min(1)]],
      maThuoc: ['', [Validators.required, Validators.maxLength(255)]],
      giaNhap: [0],
      tenThuoc: ['', [Validators.required, Validators.maxLength(1024)]],
      giaBanLe: [0],
      thongTin: [],
      donViThuNguyenMaDonViTinh: [0],
      barCode: ['', Validators.maxLength(20)],
      heSo: [1, [Validators.required, Validators.min(1)]],
      hangTuVan: [false],
      giaBanBuon: [0],
      hanDung: ['', Validators.nullValidator, dateValidator],
      soDuDauKy: [0],
      giaDauKy: [0],
      discount: [0],
      discountByRevenue: [],
      presentation: [false],
      scorable: [false],
      moneyToOneScoreRate: [0],
      hamLuong: ['', Validators.maxLength(1024)],
      quyCachDongGoi: ['', Validators.maxLength(1024)],
      nhaSanXuat: ['', Validators.maxLength(1024)],
      xuatXu: [],
      advantages: ['', Validators.maxLength(1024)],
      userObject: ['', Validators.maxLength(1024)],
      pharmacokinetics: ['', Validators.maxLength(1024)],
      userManual: ['', Validators.maxLength(1024)],
      storageConditions: [],
      storageLocation: [],
      chiDinh: [],
      chongChiDinh: [],
      registeredNo: [],
      promotionalDiscounts: [],
      enablePromotionalDiscounts: [],
      descriptionOnWebsite: [],
      gioiHan: [0],
      nhaThuocMaNhaThuoc: [],
      productTypeId: [1],
      groupIdMapping: [0],
      noted: [],
      flag: [false],
      tenDonViTinhXuatLe: [],
      tenDonViTinhThuNguyen: [],
      typeService: [LOAI_SAN_PHAM.THUOC]
    });
  }

  async ngOnInit() {
    this.getDataFilter();
    if (this.drugId) {
      const data = await this.detail(this.drugId);
      this.formData.patchValue(data);
      this.dataThayThe = data.replaceGoods;
      this.dataBanKem = data.bundleGoods;
    }
    else {
      // Generate mã thuốc
      this._service.generateDrugCode({}).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          this.formData.patchValue({ maThuoc: res.data });
        }
      });
      // Generate mã vạch thuốc
      this.genBarcode();
    }
  }

  getDataFilter() {
    // Nhóm thuốc
    this.nhomThuocService.searchList({ typeGroupProduct: LOAI_SAN_PHAM.THUOC }).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhomThuoc = res.data
      }
    });
    // Đơn vị tính
    this.donViTinhService.searchList({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listDonViTinh = res.data
      }
    });
    // Vị trí kho
    this.warehouseLocationService.searchList({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listWarehouse = res.data
      }
    });
    // Loại thuốc
    this.productTypesService.searchList({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listProductTypes = res.data;
      }
    });

    this.listThuoc$ = this.searchThuocTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let bodyThuoc = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            recordStatusId: 0,
            searchInfoType: 0,
            searchType: 5,
            ignoreLoadingIndicator: true,
            typeService: 0
          };
          return from(this.thuocService.searchPage(bodyThuoc).then((res) => {
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

  async createUpdate() {
    let body = this.formData.value;
    body.replaceGoods = this.dataThayThe;
    body.bundleGoods = this.dataBanKem;
    console.log(body, "body");
    let res = await this.save(body);
    if (res) {
      this.dialogRef.close(res);
    }
  }

  genBarcode() {
    this._service.generateBarCode({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.formData.patchValue({ barCode: res.data });
      }
    });
  }

  onExpiredDateChange() {
    var value = this.formData.get('hanDung')?.value;
    this.formData.get('hanDung')?.setValue(value.replace(/^([\d]{2})([\d]{2})([\d]{2})$/, "$1/$2/20$3"));
  }

  onChangeDonVi(type: any) {
    if (type == 0) {
      if (this.formData.value?.donViXuatLeMaDonViTinh > 0)
        this.formData.patchValue({ tenDonViTinhXuatLe: this.listDonViTinh.find(i => i.id == this.formData.value?.donViXuatLeMaDonViTinh).tenDonViTinh });
      else
        this.formData.patchValue({ tenDonViTinhXuatLe: '' });
    }
    else {
      if (this.formData.value?.donViThuNguyenMaDonViTinh > 0)
        this.formData.patchValue({ tenDonViTinhThuNguyen: this.listDonViTinh.find(i => i.id == this.formData.value?.donViThuNguyenMaDonViTinh).tenDonViTinh });
      else
        this.formData.patchValue({ tenDonViTinhThuNguyen: '' });
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  openAddEditNhomThuocDialog() {
    const dialogRef = this.dialog.open(DrugGroupAddEditDialogComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.nhomThuocService.searchList({}).then((res) => {
          if (res?.status == STATUS_API.SUCCESS) {
            this.listNhomThuoc = res.data
          }
        });
      }
    });
  }

  async onDrugChange(data: any) {
    if (data && data.id > 0) {
      this.thuocService.getDetail(data.id).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          var item = res.data;
          let object = {
            drugId: item.id,
            maThuoc: item.maThuoc,
            tenThuoc: item.tenThuoc,
          }
          this.dataThayThe.push(object)
          console.log(this.dataThayThe, "000")
        }
      });
    }
  }

  async onDrugChangeBanKem(data: any) {
    if (data && data.id > 0) {
      this.thuocService.getDetail(data.id).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          var item = res.data;
          let object = {
            drugId: item.id,
            maThuoc: item.maThuoc,
            tenThuoc: item.tenThuoc,
          }
          this.dataBanKem.push(object)
          console.log(this.dataBanKem, "000")
        }
      });
    }
  }


}
