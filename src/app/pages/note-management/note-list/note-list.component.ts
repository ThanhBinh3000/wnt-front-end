import {AfterViewInit, Component, EventEmitter, Injector, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {DATE_RANGE, LOAI_PHIEU, LOAI_SAN_PHAM, RECORD_STATUS} from "../../../constants/config";
import {BaseComponent} from "../../../component/base/base.component";
import {ReceiptNoteTableComponent} from "./receipt-note-table/receipt-note-table.component";
import {DeliveryNoteTableComponent} from "./delivery-note-table/delivery-note-table.component";
import {
  ReturnFromCustomerNoteTableComponent
} from "./return-from-customer-note-table/return-from-customer-note-table.component";
import {
  ReturnToSupplierNoteTableComponent
} from "./return-to-supplier-note-table/return-to-supplier-note-table.component";
import {ReserveNoteTableComponent} from "./reserve-note-table/reserve-note-table.component";
import {InventoryNoteTableComponent} from "./inventory-note-table/inventory-note-table.component";
import {CancelDeliveryNoteTableComponent} from "./cancel-delivery-note-table/cancel-delivery-note-table.component";
import {WaitNoteTableComponent} from "./wait-note-table/wait-note-table.component";
import {MedicalNoteTableComponent} from "./medical-note-table/medical-note-table.component";
import {
  WarehouseTransferNoteTableComponent
} from "./warehouse-transfer-note-table/warehouse-transfer-note-table.component";
import {ServiceNoteTableComponent} from "./service-note-table/service-note-table.component";
import {
  ReceiptMedicalFeeNoteTableComponent
} from "./receipt-medical-fee-note-table/receipt-medical-fee-note-table.component";
import {SETTING} from "../../../constants/setting";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {BacSiesService} from "../../../services/medical/bac-sies.service";
import {UserProfileService} from "../../../services/system/user-profile.service";
import {catchError, concat, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {ThuocService} from "../../../services/products/thuoc.service";
import {KhachHangService} from "../../../services/customer/khach-hang.service";
import {NhaCungCapService} from "../../../services/categories/nha-cung-cap.service";
import {PhieuXuatService} from "../../../services/inventory/phieu-xuat.service";

@Component({
  selector: 'note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css'],
})
export class NoteListComponent extends BaseComponent implements OnInit, AfterViewInit {
  title = '';
  @ViewChild(ReceiptNoteTableComponent) receiptNoteTable!: ReceiptNoteTableComponent;
  @ViewChild(DeliveryNoteTableComponent) deliveryNoteTable!: DeliveryNoteTableComponent;
  @ViewChild(ReturnFromCustomerNoteTableComponent) returnFromCustomerNoteTable!: ReturnFromCustomerNoteTableComponent;
  @ViewChild(ReturnToSupplierNoteTableComponent) returnToSupplierNoteTable!: ReturnToSupplierNoteTableComponent;
  @ViewChild(WarehouseTransferNoteTableComponent) warehouseTransferNoteTable!: WarehouseTransferNoteTableComponent;
  @ViewChild(InventoryNoteTableComponent) inventoryNoteTable!: InventoryNoteTableComponent;
  @ViewChild(CancelDeliveryNoteTableComponent) cancelDeliveryNoteTable!: CancelDeliveryNoteTableComponent;
  @ViewChild(ReserveNoteTableComponent) reserveNoteTable!: ReserveNoteTableComponent;
  @ViewChild(WaitNoteTableComponent) waitNoteTable!: WaitNoteTableComponent;
  @ViewChild(MedicalNoteTableComponent) medicalNoteTable!: MedicalNoteTableComponent;
  @ViewChild(ServiceNoteTableComponent) serviceNoteTable!: ServiceNoteTableComponent;
  @ViewChild(ReceiptMedicalFeeNoteTableComponent) receiptMedicalFeeNoteTable!: ReceiptMedicalFeeNoteTableComponent;
  formDataChange = new EventEmitter();
  isDeleted: boolean = false;
  noteTypes: Array<any> = [];
  listNhaThuoc: any[] = [];
  listThuoc$ = new Observable<any[]>;
  listNhanVien$ = new Observable<any[]>;
  listBacSy$ = new Observable<any[]>;
  listKhachHang$ = new Observable<any[]>;
  listNCC$ = new Observable<any[]>;
  searchNhanVienTerm$ = new Subject<string>();
  searchBacSyTerm$ = new Subject<string>();
  searchThuocTerm$ = new Subject<string>();
  searchKhachHangTerm$ = new Subject<string>();
  searchNCCTerm$ = new Subject<string>();
  paymentTypes = [
    { name: "Tiền mặt", value: 0 },
    { name: "Chuyển khoản", value: 1 },
  ];
  syncStatus = [
    { name: "Đã đồng bộ", value: 3 },
    { name: "Chưa đồng bộ", value: 1 },
  ];
  // Settings
  viewMultipleWarehousesFromReports = this.authService.getSettingByKey(SETTING.VIEW_MULTIPLE_WAREHOUSES_FROM_REPORTS);
  useClinicIntegration = this.authService.getSettingByKey(SETTING.USE_CLINIC_INTEGRATION);
  autoSynchronizeDeliveryNote = this.authService.getSettingByKey(SETTING.AUTO_SYNCHRONIZE_DELIVERY_NOTE);
  enableElectronicInvoice = this.authService.getSettingByKey(SETTING.ENABLE_ELECTRONIC_INVOICE);
  enableCustomerToSupplier = this.authService.getSettingByKey(SETTING.ENABLE_CUSTOMER_TO_SUPPLIER);
  // Authorities
  receiptNoteImportExcel = true;
  deliveryNoteImportExcel = true;
  transWarehouseImportExcel = true;

  protected readonly LOAI_PHIEU = LOAI_PHIEU;
  protected readonly RECORD_STATUS = RECORD_STATUS;

  constructor(
    injector: Injector,
    private titleService: Title,
    private phieuXuatService : PhieuXuatService,
    private nhaThuocsService : NhaThuocsService,
    private userProfileService: UserProfileService,
    private bacSiesService: BacSiesService,
    private thuocsService: ThuocService,
    private khachHangService: KhachHangService,
    private nhaCungCapService: NhaCungCapService
  ) {
    super(injector, nhaThuocsService);
    this.formData = this.fb.group({
      textSearch: [''],
      searchType: [null],
      maNhaThuoc: [this.getMaNhaThuoc()],
      noteTypeId: [LOAI_PHIEU.PHIEU_NHAP],
      paymentTypeId: [null],
      synStatusId: [null],
      khachHangMaKhachHang: [null],
      nhaCungCapMaNhaCungCap: [null],
      recordStatusId: this.isDeleted ? RECORD_STATUS.DELETED : RECORD_STATUS.ACTIVE,
      thuocIds: [], // searchType: 0
      soPhieu: [null], // searchType: 1
      createdByUserId: [null], // searchType: 2
      dienGiai: [null], // searchType: 3
      soLo: [null], // searchType: 4
      hanDung: [null], // searchType: 5
      soHoaDon: [null], // searchType: 6
      maDonThuocDienTu: [null], // searchType: 7
      idDoctor: [null], // searchType: 8
    });
  }

  ngOnInit() {
    this.route.data.subscribe((data: any) => {
      this.isDeleted = data.isDeleted;
    });
    this.route.queryParams.subscribe(params => {
      const noteTypeId = params['noteTypeId'];
      if(noteTypeId) {
        this.formData.patchValue({
          noteTypeId: Number(noteTypeId)
        });
      }
    });
    this.title = this.isDeleted ? "Khôi phục các chứng từ bị xóa" : "Tra cứu phiếu Nhập/Xuất";
    this.titleService.setTitle(this.title);
    this.getDataFilter();
  }

  async ngAfterViewInit() {
    this.noteTypes = [
      {
        id: LOAI_PHIEU.PHIEU_NHAP,
        name: "Nhập kho",
        tableTitle: "Danh sách phiếu nhập hàng",
        viewChild: this.receiptNoteTable,
        searchTypes: [
          { name: "Mã sản phẩm", value: 0 },
          { name: "Mã số phiếu", value: 1 },
          { name: "Nhân viên", value: 2 },
          { name: "Diễn giải", value: 3 },
          { name: "Số lô", value: 4 },
          { name: "Hạn dùng", value: 5 },
          { name: "Số hoá đơn", value: 6 },
        ]
      },
      {
        id: LOAI_PHIEU.PHIEU_XUAT,
        name: "Xuất bán",
        tableTitle: "Danh sách phiếu xuất bán",
        viewChild: this.deliveryNoteTable,
        searchTypes: [
          { name: "Mã sản phẩm", value: 0 },
          { name: "Mã số phiếu", value: 1 },
          { name: "Nhân viên", value: 2 },
          { name: "Diễn giải", value: 3 },
          { name: "Số hoá đơn", value: 6 },
          { name: "Mã đơn thuốc điện tử", value: 7 },
        ]
      },
      {
        id: LOAI_PHIEU.PHIEU_NHAP_TU_KH,
        name: "Nhập lại từ khách hàng",
        tableTitle: "Danh sách phiếu khách trả lại hàng",
        viewChild: this.returnFromCustomerNoteTable,
        searchTypes: [
          { name: "Mã sản phẩm", value: 0 },
          { name: "Mã số phiếu", value: 1 },
          { name: "Nhân viên", value: 2 },
          { name: "Diễn giải", value: 3 },
        ]
      },
      {
        id: LOAI_PHIEU.PHIEU_TRA_LAI_NCC,
        name: "Xuất về nhà cung cấp",
        tableTitle: "Danh sách phiếu trả lại nhà cung cấp",
        viewChild: this.returnToSupplierNoteTable,
        searchTypes: [
          { name: "Mã sản phẩm", value: 0 },
          { name: "Mã số phiếu", value: 1 },
          { name: "Nhân viên", value: 2 },
          { name: "Diễn giải", value: 3 },
        ]
      },
      {
        id: LOAI_PHIEU.PHIEU_CHUYEN_KHO,
        name: "Phiếu chuyển kho",
        tableTitle: "Danh sách phiếu chuyển kho",
        viewChild: this.warehouseTransferNoteTable,
        searchTypes: [
          { name: "Mã sản phẩm", value: 0 },
          { name: "Mã số phiếu", value: 1 },
          { name: "Nhân viên", value: 2 },
          { name: "Diễn giải", value: 3 },
        ]
      },
      {
        id: LOAI_PHIEU.PHIEU_KIEM_KE,
        name: "Phiếu kiểm kê",
        tableTitle: "Danh sách phiếu kiểm kê",
        viewChild: this.inventoryNoteTable,
        searchTypes: [
          { name: "Mã sản phẩm", value: 0 },
          { name: "Mã số phiếu", value: 1 },
          { name: "Nhân viên", value: 2 },
        ]
      },
      {
        id: LOAI_PHIEU.PHIEU_XUAT_HUY,
        name: "Phiếu xuất hủy",
        tableTitle: "Danh sách phiếu xuất hủy",
        viewChild: this.cancelDeliveryNoteTable,
        searchTypes: [
          { name: "Mã sản phẩm", value: 0 },
          { name: "Mã số phiếu", value: 1 },
          { name: "Nhân viên", value: 2 },
          { name: "Diễn giải", value: 3 },
        ]
      },
      {
        id: LOAI_PHIEU.PHIEU_DU_TRU,
        name: "Phiếu dự trù",
        tableTitle: "Danh sách phiếu dự trù",
        viewChild: this.reserveNoteTable,
        searchTypes: [
          { name: "Mã sản phẩm", value: 0 },
          { name: "Mã số phiếu", value: 1 },
          { name: "Nhân viên", value: 2 },
        ]
      },
    ];
    if(this.useClinicIntegration.activated && this.isDeleted){
      this.noteTypes = [...this.noteTypes,
        {
          id: LOAI_PHIEU.PHIEU_CHO_KHAM,
          name: "Phiếu chờ khám",
          tableTitle: "Danh sách phiếu chờ khám bệnh",
          viewChild: this.waitNoteTable,
          searchTypes: [
            { name: "Người tiếp nhận", value: 2 },
          ]
        },
        {
          id: LOAI_PHIEU.PHIEU_KHAM_BENH,
          name: "Phiếu khám bệnh",
          tableTitle: "Danh sách phiếu khám bệnh",
          viewChild: this.medicalNoteTable,
          searchTypes: [
            { name: "Mã số phiếu", value: 1 },
            { name: "Người tiếp nhận", value: 2 },
            { name: "Bác sĩ", value: 8 },
          ]
        },
        {
          id: LOAI_PHIEU.PHIEU_DICH_VU,
          name: "Phiếu dịch vụ",
          tableTitle: "Danh sách phiếu dịch vụ",
          viewChild: this.serviceNoteTable,
          searchTypes: [
            { name: "Mã số phiếu", value: 1 },
            { name: "Người thực hiện", value: 2 },
            { name: "Bác sĩ", value: 8 },
          ]
        },
        {
          id: LOAI_PHIEU.PHIEU_THU_TIEN,
          name: "Phiếu thu tiền khám bệnh",
          tableTitle: "Danh sách phiếu thu tiền khám bệnh",
          viewChild: this.receiptMedicalFeeNoteTable,
          searchTypes: [
            { name: "Mã số phiếu", value: 1 },
          ]
        },
      ];
    }
    this.getSearchType();
    await this.searchPage();
  }

  getDataFilter() {
    // Danh sách nhà thuốc quản lý
    if(this.viewMultipleWarehousesFromReports.activated){
      this.nhaThuocsService.searchList({
        maNhaThuocCha: this.getMaNhaThuoc(),
        isConnectivity: false,
        hoatDong: true
      }).then((res) => {
        if (res?.status == STATUS_API.SUCCESS) {
          this.listNhaThuoc = res.data;
          if(!this.listNhaThuoc.some((i: any) => i.maNhaThuoc == this.getMaNhaThuoc())) {
            this.listNhaThuoc.unshift(this.authService.getNhaThuoc());
          }
        }
      });
    }
    // Danh sách nhân viên
    this.listNhanVien$ = this.searchNhanVienTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if(term.length >= 2){
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            maNhaThuoc: this.formData.get('maNhaThuoc')?.value,
          };
          return from(this.userProfileService.searchPage(body).then((res) => {
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
    // Danh sách bác sĩ
    this.listBacSy$ = this.searchBacSyTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if(term.length >= 2){
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            maNhaThuoc: this.formData.get('maNhaThuoc')?.value,
          };
          return from(this.bacSiesService.searchPage(body).then((res) => {
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
        if(term.length >= 2){
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
            maNhaThuoc: this.formData.get('maNhaThuoc')?.value,
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
    // Search nhà cung cấp
    this.listNCC$ = this.searchNCCTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if(term.length >= 2){
          let body = {
            textSearch: term,
            paggingReq: { limit: 25, page: 0 },
            dataDelete: false,
            maNhaThuoc: this.formData.get('maNhaThuoc')?.value,
          };
          return from(this.nhaCungCapService.searchPage(body).then((res) => {
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
    const viewChild = this.noteTypes.find((item: any) => item.id == this.getNoteType())?.viewChild;
    if(viewChild){
      await viewChild.searchPage();
    }
  }

  getSearchTypes() {
    return this.noteTypes.find((item: any) => item.id == this.getNoteType())?.searchTypes;
  }

  getSearchType() {
    this.clearSearchTypeValue();
    const searchTypes = this.getSearchTypes();
    this.formData.patchValue({
      searchType: searchTypes[0].value
    });
  }

  clearSearchTypeValue() {
    this.formData.patchValue({
      thuocIds: [], // searchType: 0
      soPhieu: [null], // searchType: 1
      createdByUserId: [null], // searchType: 2
      dienGiai: [null], // searchType: 3
      soLo: [null], // searchType: 4
      hanDung: [null], // searchType: 5
      soHoaDon: [null], // searchType: 6
      maDonThuocDienTu: [null], // searchType: 7
      idDoctor: [null], // searchType: 8
    });
  }

  getTableTitle() {
    return this.noteTypes.find((item: any) => item.id == this.getNoteType())?.tableTitle;
  }

  getNoteType() {
    return this.formData.get('noteTypeId')?.value;
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  isSuperUser() {
    return this.authService.isSuperUser();
  }

  isAdmin() {
    return this.authService.isAdmin();
  }

  async onArchivedCheckedChanged($event: any) {
    const checked = $event.target.checked;
    if(checked) {
      this.formData.get('recordStatusId')?.setValue(RECORD_STATUS.ARCHIVED);
    } else {
      this.formData.get('recordStatusId')?.setValue(RECORD_STATUS.ACTIVE);
    }
    await this.searchPage();
  }

  async onAcceptancePendingCheckedChanged($event: any){
    const checked = $event.target.checked;
    if(checked) {
      this.formData.get('recordStatusId')?.setValue(RECORD_STATUS.ACCEPTANCE_PENDING);
    } else {
      this.formData.get('recordStatusId')?.setValue(RECORD_STATUS.ACTIVE);
    }
    await this.searchPage();
  }

  async onImport() {

  }

  async onImportInvoice() {

  }

  async onExport() {

  }

  async onExportMultipleInvoice() {
    await this.deliveryNoteTable.onExportMultipleInvoice();
  }

  async onSync() {
    if (this.totalRecord >= 1000) {
      this.modal.confirm({
        closable: false,
        title: 'Xác nhận',
        content: "Mỗi lần đồng bộ Hệ thống sẽ đồng bộ tối đa 1000 phiếu bạn có muốn đồng bộ?",
        okText: 'Đồng ý',
        cancelText: 'Không',
        okDanger: true,
        width: 310,
        onOk: async () => {
          let res = await this.phieuXuatService.sync({ nhaThuocMaNhaThuoc: this.getMaNhaThuoc(), listIds: [] });
          if (res && res.data) {
            this.notification.success(MESSAGE.SUCCESS, "Đồng bộ hoá đơn thành công.");
          }
        },
      });
    } else {
      let res = await this.phieuXuatService.sync({ nhaThuocMaNhaThuoc: this.getMaNhaThuoc(), listIds: [] });
      if (res && res.data) {
        this.notification.success(MESSAGE.SUCCESS, "Đồng bộ hoá đơn thành công.");
      }
    }
  }

  async onResetSyncMultiple() {
    await this.deliveryNoteTable.onResetSyncMultiple();
  }

  async onDeleteMultiple() {
    const viewChild = this.noteTypes.find((item: any) => item.id == this.getNoteType())?.viewChild;
    if(viewChild){
      if(this.isDeleted)
        await viewChild.deleteMultiDatabase('Bạn thực sự muốn xóa vĩnh viễn các phiếu được chọn?');
      else
        await viewChild.deleteMulti('Bạn thực sự muốn xóa các phiếu được chọn?');
    }
  }

}
