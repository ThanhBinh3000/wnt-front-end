import { Component, Injector, OnInit, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { SETTING } from '../../../constants/setting';
import moment from 'moment';
import { PhieuDichVuService } from '../../../services/medical/phieu-dich-vu.service';
import { DatePipe } from '@angular/common';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { BacSiesService } from '../../../services/medical/bac-sies.service';
import { MESSAGE, STATUS_API } from '../../../constants/message';
import { CustomerAddEditDialogComponent } from '../../customer/customer-add-edit-dialog/customer-add-edit-dialog.component';
import { DoctorAddEditDialogComponent } from '../../doctor/doctor-add-edit-dialog/doctor-add-edit-dialog.component';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap } from 'rxjs';
import { UserProfileService } from '../../../services/system/user-profile.service';
import { NhomThuocService } from '../../../services/products/nhom-thuoc.service';
import { ThuocService } from '../../../services/products/thuoc.service';
import { LOAI_SAN_PHAM } from '../../../constants/config';
import { calculateAge, calculateAgeInMonthsOrYears, getAgeUnit } from '../../../utils/date.utils';
import { Validators } from '@angular/forms';
import { PhongKhamsService } from '../../../services/medical/phong-khams.service';

@Component({
  selector: 'app-service-note',
  templateUrl: './service-note-add-edit.component.html',
  styleUrls: ['./service-note-add-edit.component.css'],
})
export class ServiceNoteAddEditComponent extends BaseComponent implements OnInit {
  title: string = "PHIẾU DỊCH VỤ";
  displayedColumnsService: string[] = ['checkbox', 'ma', 'ten', 'nhom', 'chiPhi'];
  listBacSies: any[] = [];
  listNhanVien: any[] = [];
  listNhomDichVu: any[] = [];
  listService: any[] = [];
  servicePackages: any[] = [];
  listPhongKham: any[] = []
  listKhachHang$ = new Observable<any[]>;
  searchKhachHangTerm$ = new Subject<string>();
  listDichVu$ = new Observable<any[]>;
  searchDichVuTerm$ = new Subject<string>();
  nhomDichVuId: any = -1;
  dichVuId: any;
  totalMoney: any = 0;
  displayedColumns: string[] = this.getDisplayedColumns();

  // Settings
  useDoctorCommon = this.authService.getSettingByKey(SETTING.USE_CUSTOMER_COMMON);
  useCustomerCommon = this.authService.getSettingByKey(SETTING.USE_CUSTOMER_COMMON);

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: PhieuDichVuService,
    private datePipe: DatePipe,
    private bacSiesService: BacSiesService,
    private khachHangService: KhachHangService,
    private userProfileService: UserProfileService,
    private nhomDichVuService: NhomThuocService,
    private dichVuService: ThuocService,
    private phongKhamService: PhongKhamsService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [0],
      noteDate: [this.datePipe.transform(moment().utc().startOf('day').toDate(), 'dd/MM/yyyy HH:mm:ss')],
      date: [],
      idCus: ['', Validators.required],
      customer: this.fb.group({
        id: [],
        tenKhachHang: [],
        diaChi: [''],
        birthDate: [{ value: '', disabled: true }],
        age: [],
        ageUnit: [],
        sexId: [{ value: '', disabled: true }],
        soDienThoai: ['']
      }),
      barCode: [''],
      noteNumber: [],
      idDoctor: [0, [Validators.required, Validators.min(1)]],
      performerId: [0],
      isDeb: [],
      isLock: [],
      description: [''],
      recordStatusId: [0],
    })
  }

  getDisplayedColumns() {
    var val = ['#', 'ten', 'nhom', 'dichVuDaMua', 'soLuong', 'soBuoiThucHien', 'donGia', 'thanhTien', 'phongThucHien', 'ketThuc', 'action'];
    if (this.servicePackages.length <= 0) {
      val = val.filter(e => e !== 'dichVuDaMua');
    }
    return val;
  }

  async ngOnInit() {
    this.getId();
    if (this.idUrl) {
      let data = await this.detail(this.idUrl)
      console.log(data);
      this.formData.patchValue(data);
      if (data.idCus > 0) {
        this.listKhachHang$ = of([data.customer]);
      }
      // data.chiTiets.forEach(item => {

      // });
      this.dataTable.push(...data.chiTiets);
    }
    else {
      this.service.init({}).then((res) => {
        if (res && res.data) {
          const data = res.data;
          this.formData.patchValue({
            noteDate: data.noteDate,
            barCode: data.barCode,
            noteNumber: data.noteNumber,
          })
        }
      });
    }
    this.pageSize = 9000;
    this.titleService.setTitle(this.title);
    this.getDataFilter();
    await this.getListService();
  }

  createUpdate() {
    if (this.dataTable.length == 0) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
      return;
    }
    let body = this.formData.value;
    body.chiTiets = this.dataTable;
    this.save(body).then(res => {
      if (res) {
        this.router.navigate(['/management/service-note/list']);
      }
    });
  }

  getDataFilter() {
    // Bác sĩ
    this.getListBacSies();
    // Người thực hiện
    this.getListNhanVien();
    // Search khách hàng
    this.listKhachHang$ = this.searchKhachHangTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            maNhaThuoc: this.useCustomerCommon.activated ? this.getMaNhaThuocCha() : this.getMaNhaThuoc(),
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
    // Nhóm dịch vụ
    this.getListNhomDichVu();
    // Dịch vụ
    this.listDichVu$ = this.searchDichVuTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            maNhaThuoc: this.getMaNhaThuocCha() != null && this.getMaNhaThuocCha() != '' ? this.getMaNhaThuocCha() : this.getMaNhaThuoc(),
            typeService: LOAI_SAN_PHAM.DICH_VU,
          };
          return from(this.dichVuService.searchPage(body).then((res) => {
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
    // Phòng khám
    this.phongKhamService.searchList({ maNhaThuoc: this.getMaNhaThuoc() }).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listPhongKham = res.data
      }
    });
  }

  getListBacSies() {
    let body = {
      maNhaThuoc: this.useDoctorCommon.activated ? this.getMaNhaThuocCha() : this.getMaNhaThuoc(),
      paggingReq: { limit: 1000, page: 0 },
      dataDelete: false,
    };
    this.bacSiesService.searchPage(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listBacSies = res.data.content;
      }
    });
  }

  getListNhanVien() {
    let body = {
      maNhaThuoc: this.getMaNhaThuoc(),
      paggingReq: { limit: 1000, page: 0 },
      dataDelete: false,
    };
    this.userProfileService.searchPageStaffManagement(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhanVien = res.data.content;
      }
    });
  }

  getListNhomDichVu() {
    let body = {
      maNhaThuoc: this.getMaNhaThuocCha() != null && this.getMaNhaThuocCha() != '' ? this.getMaNhaThuocCha() : this.getMaNhaThuoc(),
      paggingReq: { limit: 1000, page: 0 },
      typeGroupProduct: LOAI_SAN_PHAM.DICH_VU,
      dataDelete: false,
    };
    this.nhomDichVuService.searchPage(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listNhomDichVu = res.data.content;
        this.listNhomDichVu = this.listNhomDichVu.filter(x => x.tenNhomThuoc != 'Nhóm combo');
      }
    });
  }

  async getListService() {
    let body = {
      paggingReq: {
        limit: this.pageSize,
        page: this.page - 1
      },
      dataDelete: false,
      maNhaThuoc: this.getMaNhaThuocCha() != null && this.getMaNhaThuocCha() != '' ? this.getMaNhaThuocCha() : this.getMaNhaThuoc(),
      typeService: LOAI_SAN_PHAM.DICH_VU,
      nhomThuocMaNhomThuoc: this.nhomDichVuId > 0 ? this.nhomDichVuId : null,
      id: this.dichVuId > 0 ? this.dichVuId : null,
    };
    await this.dichVuService.searchPage(body).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listService = res.data.content;
        this.totalRecord = res.data.totalElements;
        this.totalPages = res.data.totalPages;
        if (this.listService != null) {
          for (var i = 0; i < this.listService.length; i++) {
            if (this.dataTable.some(x => x.drugId == this.listService[i].drugId)) {
              this.listService[i].checked = true;
            }
          }
        }
        console.log(this.listService);
      }
    });
  }

  //Lấy ra dịch vụ của khách hàng đã mua và chưa sd
  getServicePackagesByCustomer() {
    this._service.getServicePackagesByCustomer({ idCus: this.formData.value?.idCus }).then((res: any) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.servicePackages = res.data
      }
    });
  }

  //Khi mà khách chọn dịch vụ liệu trình đã mua và chưa sd giảm số lượng sd ở gói đấy đi
  onServicePackage(gridItem: any) {
    if (this.servicePackages != null) {
      this.servicePackages.forEach(i => {
        if (i.id == gridItem.idNoteDetail && i.added == undefined) {
          if (i.countNumbers == 0) {
            this.notification.error(MESSAGE.ERROR, 'Gói dịch vụ liệu trình này đã sử dụng hết.');
            gridItem.idNoteDetail = 0;
            return;
          }
          i.countNumbers = i.countNumbers - (gridItem.countNumbers * gridItem.amount);
          gridItem.implementationRoomCode = i.idClinic;
          this.formData.patchValue({ idDoctor: i.bacSies.id });
          i.added = true;
        }
      });
    }
  }

  override async changePageSize(event: any) {
    try {
      this.pageSize = event;
      this.getListService();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  override async changePageIndex(event: any) {
    try {
      this.page = event;
      this.getListService();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  getDetailCustomer($event: any) {
    $event.age = calculateAgeInMonthsOrYears($event.birthDate);
    $event.ageUnit = getAgeUnit($event.birthDate);
    $event.birthDate = moment($event.birthDate, 'DD/MM/YYYY hh:mm:ss').format('DD/MM/YYYY');
    this.formData.patchValue({ customer: $event });
  }

  generateBarcode() {
    this._service.generateBarCode({}).then((res: any) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.formData.patchValue({ barCode: res.data });
      }
    });
  }

  //Thêm dịch vụ theo nhóm
  addNewItems() {
    var total = 0;
    this.listService.forEach(x => {
      var check = this.dataTable.some(xx => xx.drugId == x.id);
      if (check == false) {
        var data: any = { id: 0 };
        data.drugId = x.id;
        data.tenThuoc = x.tenThuoc;
        data.tenNhomThuoc = x.tenNhomThuoc;
        data.implementationRoomCode = x.idClinic;
        data.isEditingItem = false;
        data.amount = 1;
        data.countNumbers = x.countNumbers;
        data.countNumbersOld = x.countNumbers;
        data.retailOutPrice = x.giaBanLe;
        data.retailOutPriceOld = x.giaBanLe;
        this.dataTable.push(data);
        x.checked = true;
      }
    });
    for (var i = 0; i < this.dataTable.length; i++) {
      total += this.dataTable[i].retailOutPrice * this.dataTable[i].amount;
    }
    this.totalMoney = total;
  }

  //Thêm dịch vụ vừa chọn vào list dịch vụ
  addNewItem(drugItem: any) {
    var data: any = { id: 0 };
    data.drugId = drugItem.id;
    data.tenThuoc = drugItem.tenThuoc;
    data.tenNhomThuoc = drugItem.tenNhomThuoc;
    data.implementationRoomCode = drugItem.idClinic;
    data.isEditingItem = false;
    data.countNumbers = drugItem.countNumbers;
    data.countNumbersOld = drugItem.countNumbers;
    data.retailOutPrice = drugItem.giaBanLe;
    data.retailOutPriceOld = drugItem.giaBanLe;
    data.amount = 1;
    var check = this.dataTable.some(x => x.drugId == data.drugId);
    if (check == false) {
      //if ($scope.servicePackages != null) {
      //    $scope.servicePackages.forEach(i => {
      //        if (i.IdService == drugItem.DrugId) {
      //            app.notice.error('bạn đã mua gói dv này vui lòng sử dụng hết trước khi mua gói mới');
      //            drugItem.Checked = false;
      //            return;
      //    }
      //    });
      //}
      this.dataTable.push(data);
      var total = 0;
      for (var i = 0; i < this.dataTable.length; i++) {
        total += this.dataTable[i].retailOutPrice * this.dataTable[i].amount;
      }
      this.totalMoney = total;
    } else {
      // drugItem.checked = true;
      // this.notification.error(MESSAGE.ERROR, 'Dịch vụ này đã được chọn.');
      this.dataTable = this.dataTable.filter(x => x.drugId != data.drugId);
    }
    console.log(this.dataTable);
  }

  onDelete(drugItem: any) {
    drugItem.isEditingItem = false;
    const index = this.dataTable.indexOf(drugItem);
    if (index > -1) {
      this.dataTable.splice(index, 1);
    }

    var total = 0;
    for (var i = 0; i < this.dataTable.length; i++) {
      total += this.dataTable[i].retailOutPrice * this.dataTable[i].Amount;
    }
    if (this.servicePackages != null) {
      this.servicePackages.forEach(i => {
        if (i.id == drugItem.idNoteDetail) {
          i.countNumbers = i.countNumbers + (drugItem.countNumbers * drugItem.amount)
        }
      });
    }
    this.totalMoney = total;
    this.getListService();
  };

  //Cập nhật lai tổng tiền khi số lượng thay đổi
  amountChange() {
    var total = 0
    for (var i = 0; i < this.dataTable.length; i++) {
      total += this.dataTable[i].retailOutPrice * parseInt(this.dataTable[i].amount);
    }
    this.totalMoney = total;
  }

  onCountChange(item: any) {
    if (item.idTypeService == 1 && item.countNumbers >= 1) {
      item.retailOutPrice = (item.countNumbers / item.countNumbersOld) * item.retailOutPriceOld;
      var total = 0;
      for (var i = 0; i < this.dataTable.length; i++) {
        total += this.dataTable[i].retailOutPrice * this.dataTable[i].amount;
      }
      this.totalMoney = total;
    }
  }

  async onLockNote() {
    let locked = this.formData.get('isLock')?.value;
    const res = locked ? await this._service.unlock({ id: this.formData.get('id')?.value }) : await this._service.lock({ id: this.formData.get('id')?.value });
    if (res && res.status == STATUS_API.SUCCESS) {
      this.formData.controls['isLock'].setValue(res.data.locked);
      this.notification.success(MESSAGE.SUCCESS, this.formData.get('isLock')?.value ? "Phiếu đã được khóa" : "Phiếu đã được mở");
    }
  }

  onTitleSave() {
    return this.formData.value?.isDeb == false && this.formData.value?.id > 0 ? 'Đã thanh toán' : '';
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getMaNhaThuocCha() {
    return this.authService.getNhaThuoc().maNhaThuocCha;
  }

  trackByFn(item: any) {
    return item.id;
  }

  @ViewChildren('pickerNoteDate') pickerNoteDate!: Date;
  async onDateChange(date: Date) {
    let noteDate = this.formData.get('date')?.value;
    this.formData.patchValue({ noteDate: this.datePipe.transform(noteDate, 'dd/MM/yyyy HH:mm:ss') ?? '' });
  }

  async openCustomerAddEditDialog() {
    const dialogRef = this.dialog.open(CustomerAddEditDialogComponent, {
      width: '90%',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.listKhachHang$ = of([result]);
        this.formData.patchValue({ idCus: result.id });
        this.getDetailCustomer(result);
      }
    });
  }

  async openDoctorAddEditDialog() {
    const dialogRef = this.dialog.open(DoctorAddEditDialogComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.getListBacSies();
        this.formData.patchValue({ idDoctor: result.id });
      }
    });
  }
}