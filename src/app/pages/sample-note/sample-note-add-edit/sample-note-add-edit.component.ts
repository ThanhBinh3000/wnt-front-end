import { Component, Injector, Input, OnInit, ViewChildren } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { Title } from '@angular/platform-browser';
import { SampleNoteService } from '../../../services/products/sample-note.service';
import { DatePipe } from '@angular/common';
import moment from 'moment';
import { Validators } from '@angular/forms';
import { BacSiesService } from '../../../services/medical/bac-sies.service';
import { MESSAGE, STATUS_API } from '../../../constants/message';
import { SETTING } from '../../../constants/setting';
import { DoctorAddEditDialogComponent } from '../../doctor/doctor-add-edit-dialog/doctor-add-edit-dialog.component';
import { CustomerAddEditDialogComponent } from '../../customer/customer-add-edit-dialog/customer-add-edit-dialog.component';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, from, of, switchMap } from 'rxjs';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { DoctorDetailDialogComponent } from '../../doctor/doctor-detail-dialog/doctor-detail-dialog.component';
import { CustomerDetailDialogComponent } from '../../customer/customer-detail-dialog/customer-detail-dialog.component';
import { ThuocService } from '../../../services/products/thuoc.service';
import { LOAI_SAN_PHAM } from '../../../constants/config';
import { DrugDetailDialogComponent } from '../../drug/drug-detail-dialog/drug-detail-dialog.component';
import { EsDiagnoseService } from '../../../services/categories/esdiagnose.service';
import { DrugUpdateInfoUseDialogComponent } from '../drug-update-info-use-dialog/drug-update-info-use-dialog.component';

@Component({
  selector: 'sample-note-add-edit',
  templateUrl: './sample-note-add-edit.component.html',
  styleUrls: ['./sample-note-add-edit.component.css'],
})
export class SampleNoteAddEditComponent extends BaseComponent implements OnInit {
  title: string = "Thông tin chung đơn/liều mẫu";
  displayedColumns: string[] = [];
  listTypeSample: any[] = [];
  listTypeSample3214: any[] = [];
  listTypeFormOfTreatment: any[] = [];
  listBacSies: any[] = [];
  listKhachHang$ = new Observable<any[]>;
  searchKhachHangTerm$ = new Subject<string>();
  listThuoc$ = new Observable<any[]>;
  searchThuocTerm$ = new Subject<string>();
  listDiagnose$ = new Observable<any[]>;
  searchDiagnoseTerm$ = new Subject<string>();
  browserList = ['Ngày uống 3 gói chia 3 lần trước ăn sáng -trưa - tối trước khi ngủ',
    'Ngày 4 viên chia 2 lần sau ăn',
    'Ngày 1 viên sau ăn sáng',
    'Ngày 1 viên trước ăn sáng',
    'Ngày 4 viên chia 2 lần trước ăn 30 phút',
    'Đặt âm đạo 1 viên trước khi đi ngủ',
    'Ngày uống 2 viên trước sau sáng'];

  isConnect: boolean = false;
  deviceType: number = 0;
  copyId: number = 0;
  menuItems: any[] = []

  // Settings
  useDoctorCommon = this.authService.getSettingByKey(SETTING.USE_CUSTOMER_COMMON);
  useCustomerCommon = this.authService.getSettingByKey(SETTING.USE_CUSTOMER_COMMON);
  useSampleNoteFromParent = this.authService.getSettingByKey(SETTING.USE_SAMPLE_NOTE_FROM_PARENT);
  warningOfInventory = this.authService.getSettingByKey(SETTING.NEGATIVE_PRESCRIBING_ARE_NOT_ALLOW);
  useClinicIntegration = this.authService.getSettingByKey(SETTING.USE_CLINIC_INTEGRATION);
  applyMultipleDosesOfMedication = this.authService.getSettingByKey(SETTING.APPLY_MULTIPLE_DOSES_OF_MEDICATION);
  refStoreCode = this.authService.getSettingByKey(SETTING.REF_STORE_FOR_PRODUCTS);

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: SampleNoteService,
    private datePipe: DatePipe,
    private bacSiesService: BacSiesService,
    private khachHangService: KhachHangService,
    private thuocService: ThuocService,
    private diagnoseService: EsDiagnoseService,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [0],
      noteDate: [this.datePipe.transform(moment().utc().startOf('day').toDate(), 'dd/MM/yyyy HH:mm:ss')],
      date: [],
      typeId: [''],
      typeSampleNote: [0],
      formOfTreatment: [0],
      noteName: ['', [Validators.required, Validators.maxLength(255)]],
      doctorId: [0],
      patientId: [],
      patientPhoneNumber: [],
      patientAddress: [],
      barcode: [''],
      conclude: [''],
      doctorComments: [''],
      chanDoanIds: [],
      diagnosticIds: [''],
      amount: [''],
      recordStatusID: [0],
      isConnect: [false],
    })
  }

  getDisplayedColumns() {
    var val = ['checkbox', '#', 'maThuoc', 'tenThuoc', 'donVi', 'soLuong', 'ton', 'dotDungThuoc', 'ghiChu', 'giaBan', 'tongTien', 'action'];
    if (!this.useClinicIntegration.activated || this.authService.getNhaThuoc().isConnectivity) {
      val = val.filter(e => e !== 'ton');
    }
    if (!this.formData.value?.isConnect) {
      val = val.filter(e => e !== 'dotDungThuoc');
    }
    else {
      val = val.filter(e => e !== 'giaBan' && e !== 'tongTien');
    }
    return val;
  }

  @ViewChildren('pickerNoteDate') pickerNoteDate!: Date;
  async onDateChange(date: Date) {
    let noteDate = this.formData.get('date')?.value;
    this.formData.patchValue({ noteDate: this.datePipe.transform(noteDate, 'dd/MM/yyyy HH:mm:ss') ?? '' });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    this.getDataFilter();
    this.print();
    this.route.data.subscribe((data: any) => {
      this.formData.patchValue({
        isConnect: data.isConnect,
      });
    });
    this.route.queryParams.subscribe(params => {
      this.copyId = Number(params['copyId']);
    });
    this.getId();
    if (this.idUrl || this.copyId > 0) {
      let noteId = !this.idUrl ? this.copyId : this.idUrl;
      let data = await this.detail(noteId);
      console.log(data);
      this.formData.patchValue(data);
      if (!this.idUrl) {
        this.formData.patchValue({
          id: 0,
          noteDate: this.datePipe.transform(moment().utc().startOf('day').toDate(), 'dd/MM/yyyy HH:mm:ss'),
        });
      }
      if (data.patientId > 0) {
        this.listKhachHang$ = of([{ id: data.patientId, tenKhachHang: data.patientName }]);
      }
      this.listDiagnose$ = of(data.diagnostics);
      this.formData.patchValue({ chanDoanIds: data.diagnosticIds?.split(',').map(Number) });
      data.chiTiets.forEach((item: any) => {
        item.listDonViTinhs = item.thuocs.listDonViTinhs;
        item.tenThuoc = item.thuocs.tenThuoc;
        item.maThuoc = item.thuocs.maThuoc;
        item.retailPrice = item.thuocs.giaBanLe;
        item.retailUnitId = item.thuocs.donViXuatLeMaDonViTinh;
      });
      this.dataTable.push(...data.chiTiets);
    }
    else {
      if (this.formData.value?.isConnect) {
        this.formData.patchValue({ typeId: "c", formOfTreatment: 2 });
      }
    }
    this.displayedColumns = this.getDisplayedColumns();
    this.title = this.formData.value?.isConnect ? 'Thông tin chung đơn/liều mẫu LT' : 'Thông tin chung đơn/liều mẫu';
  }

  getDataFilter() {
    // Loại đơn
    this.listTypeSample = [
      { id: "", label: 'Mặc định' },
      { id: "c", label: 'Đơn cơ bản' },
      { id: "h", label: 'Đơn hướng tâm thần' },
      { id: "n", label: 'Đơn thuốc gây nghiện' },
      { id: "y", label: 'Đơn thuốc cổ truyền' }
    ];
    this.listTypeSample3214 = [
      { id: 0, label: 'Đơn thuốc' },
      { id: 1, label: 'Đơn tư vấn' },
    ];
    // Hình thức điều trị
    this.listTypeFormOfTreatment = [
      { id: 0, label: 'Mặc định' },
      { id: 1, label: 'Nội trú' },
      { id: 2, label: 'Ngoại trú' },
    ];
    // Bác sĩ
    this.getListBacSies();
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
            typeService: LOAI_SAN_PHAM.THUOC,
            maNhaThuoc: this.getMaNhaThuocCha() != null && this.getMaNhaThuocCha() != '' ? this.getMaNhaThuocCha() : this.getMaNhaThuoc(),
          };
          return from(this.thuocService.searchPage(body).then((res) => {
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
    // Search Diagnose
    this.listDiagnose$ = this.searchDiagnoseTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
          };
          return from(this.diagnoseService.searchPage(body).then((res) => {
            if (res?.status == STATUS_API.SUCCESS) {
              console.log(res.data.content);
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

  getListBacSies() {
    this.bacSiesService.searchList({ maNhaThuoc: this.useDoctorCommon.activated ? this.getMaNhaThuocCha() : this.getMaNhaThuoc() }).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listBacSies = res.data
      }
    });
  }

  onChangeThuoc($event: any) {
    if (this.dataTable.filter(x => x.drugID == $event.id).length > 0) {
      this.notification.error(MESSAGE.ERROR, 'Thuốc đã tồn tại trong danh sách');
      return;
    }
    this.thuocService.getDetail($event.id).then((res) => {
      if (res && res.data) {
        const data = res.data;
        var item = {
          drugID: data.id,
          maThuoc: data.maThuoc,
          tenThuoc: data.tenThuoc,
          retailPrice: data.giaBanLe,
          listDonViTinhs: data.listDonViTinhs,
          drugUnitID: data.donViXuatLeMaDonViTinh,
          retailUnitId: data.donViXuatLeMaDonViTinh,
          comment: '',
          drugStoreID: this.useSampleNoteFromParent.activated ? this.getMaNhaThuocCha() : this.getMaNhaThuoc(),
          quantity: 1,
          tonKho: data.inventory ? data.inventory.lastValue : 0,
          heSo: data.heSo,
          fromDate: '',
          toDate: '',
          batch: '',
          numberOfPotionBars: '',
        };
        if (this.useClinicIntegration.activated && !this.isConnect && this.formData && item.tonKho == 0 && this.warningOfInventory.activated) {
          this.modal.confirm({
            closable: false,
            title: 'Xác nhận',
            content: 'Thuốc này đã hết hàng bạn có muốn kê tiếp tục không?',
            okText: 'Đồng ý',
            cancelText: 'Không',
            okDanger: true,
            width: 310,
            onOk: async () => {
              this.dataTable.push(item);
            },
          });
        }
        else {
          this.dataTable.push(item);
        }
      }
    })
  }

  getDoctorPhoneNumber(doctorId: number) {
    return this.listBacSies.find(x => x.id == doctorId).dienThoai;
  }

  getPatientDetail($event: any) {
    if ($event) {
      this.formData.patchValue({ patientPhone: $event.soDienThoai, patientAddress: $event.diaChi });
    }
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

  getTotalAmount() {
    return this.dataTable.reduce((acc, item) => acc + this.getItemAmount(item), 0);
  }

  getItemPrice(data: any) {
    var price = data.retailPrice;
    var unitId = parseInt(data.drugUnitID);
    if (unitId !== data.retailUnitId) {
      price *= data.thuocs ? data.thuocs.heSo : data.heSo;
    }
    return price;
  }

  getItemAmount(data: any) {
    var price = this.getItemPrice(data);
    return price * data.quantity;
  }

  onPayFull() {
    this.formData.patchValue({ amount: this.getTotalAmount() });
  }

  fnRemoveItem(data: any) {
    var index = this.dataTable.indexOf(data);
    if (index >= 0) {
      this.dataTable.splice(index, 1);
    }
  }

  createUpdate() {
    if (this.dataTable.length == 0) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
      return;
    }
    let body = this.formData.value;
    body.diagnosticIds = body.chanDoanIds != null ? body.chanDoanIds.join(',') : '';
    body.chiTiets = this.dataTable;
    this.save(body).then(res => {
      if (res) {
        this.router.navigate(['/management/sample-note/list']);
      }
    });
  }

  getBatchDateCss(item: any) {
    if (!item) return '';

    if (!item.fromDate || !item.foDate || item.batch <= 0 || (!item.numberOfPotionBars && this.formData.value?.typeId == 'y')) return '';

    return 'color: lightseagreen;';
  };

  async openDoctorAddEditDialog() {
    const dialogRef = this.dialog.open(DoctorAddEditDialogComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.getListBacSies();
        this.formData.patchValue({ doctorId: result.id });
      }
    });
  }

  async openDoctorDetailDialog(doctorId: any) {
    this.dialog.open(DoctorDetailDialogComponent, {
      data: doctorId,
      width: '600px',
    });
  }

  async openCustomerAddEditDialog() {
    const dialogRef = this.dialog.open(CustomerAddEditDialogComponent, {
      width: '90%',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.listKhachHang$ = of([result]);
        this.formData.patchValue({ patientId: result.id, patientPhoneNumber: result.soDienThoai, patientAddress: result.diaChi });
      }
    });
  }

  async openCustomerDetailDialog(customerId: any) {
    this.dialog.open(CustomerDetailDialogComponent, {
      data: customerId,
      width: '600px',
    });
  }

  async openDetailDialog(drugId: any) {
    this.dialog.open(DrugDetailDialogComponent, {
      data: drugId,
      width: '600px',
    });
  }

  async openDrugUpdateInfoUseDialog(item: any, type: string) {
    var data = {};
    if (type == 'only') {
      data = { type: 'only', sampleItem: item };
    }
    else {
      console.log(this.dataTable);
      if (this.dataTable.filter(x => x.checked).length == 0) {
        this.notification.error(MESSAGE.ERROR, 'Hãy chọn thuốc muốn áp dụng đợt dùng thuốc.');
        return;
      }
      data = { type: 'all', sampleItem: {} };
    }
    const dialogRef = this.dialog.open(DrugUpdateInfoUseDialogComponent, {
      width: '600px',
      data: data
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        if (type == 'only') {
          item.fromDate = result.fromDate;
          item.toDate = result.toDate;
          item.batch = result.batch;
          item.numberOfPotionBars = result.numberOfPotionBars;
        }
        else {
          this.dataTable.forEach(item => {
            if (item.checked) {
              item.fromDate = result.fromDate;
              item.toDate = result.toDate;
              item.batch = result.batch;
              item.numberOfPotionBars = result.numberOfPotionBars;
              item.comment = result.comment;
            }
          });
        }
      }
    });
  }

  print(){
    this.menuItems = [
      { loaiIn: '4', label: 'In đơn/liều - 58mm', condition: true },
      { loaiIn: '3', label: 'In đơn/liều - 80mm', condition: true },
      { loaiIn: '2', label: 'In đơn/liều - A5', condition: true },
      { loaiIn: '1', label: 'In đơn/liều - A4', condition: true },
    ];
  }
}

