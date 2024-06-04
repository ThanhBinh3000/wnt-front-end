import {Component, HostListener, Inject, Injector, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../../../component/base/base.component";
import {PhieuThuChiService} from "../../../services/thuchi/phieu-thu-chi.service";
import {DATE_RANGE, LOAI_THU_CHI, ORDER_STORE_MAPPING} from '../../../constants/config';
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {convertDateObject} from "../../../utils/date.utils";
import {DatePipe} from "@angular/common";
import {PaymentTypeService} from "../../../services/categories/payment-type.service";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";
import {UserProfileService} from "../../../services/system/user-profile.service";
import {NhanVienNhaThuocsService} from "../../../services/system/nhan-vien-nha-thuocs.service";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";

@Component({
  selector: 'other-customer-in-out-note-add-edit-dialog',
  templateUrl: './other-in-out-note-add-edit-dialog.component.html',
  styleUrls: ['./other-in-out-note-add-edit-dialog.component.css'],
})
export class OtherInOutNoteAddEditDialogComponent extends BaseComponent implements OnInit {
  listLoaiPhieu: any[] = [
    {id: LOAI_THU_CHI.THU_KHAC, name: 'Thu khác'},
    {id: LOAI_THU_CHI.CHI_KHAC, name: 'Chi khác'},
    {id: LOAI_THU_CHI.CHI_PHI_KINH_DOANH, name: 'Chi phí kinh doanh'},
  ];
  listPaymentType: any[] = [];
  listNhaThuoc: any[] = [];
  listNhanVien$ = new Observable<any[]>;
  searchNhanVienTerm$ = new Subject<string>();
  // Settings
  // Authorities
  inOutComingNoteCreate = true;
  inOutComingNoteWrite = true;
  inOutComingNoteDelete = true;
  inOutComingNotePrint = true;

  constructor(
    injector: Injector,
    private _service: PhieuThuChiService,
    private datePipe: DatePipe,
    private paymentTypeService: PaymentTypeService,
    private nhaThuocsService: NhaThuocsService,
    private userProfileService: UserProfileService,
    public dialogRef: MatDialogRef<OtherInOutNoteAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [0],
      nhaThuocMaNhaThuoc: [null],
      khachHangMaKhachHang: [null],
      nhaCungCapMaNhaCungCap: [null],
      soPhieu: [null],
      ngayTao: [null],
      pickerNgayTao: [new Date()],
      loaiPhieu: [LOAI_THU_CHI.THU_KHAC],
      amount: [0],
      dienGiai: [''],
      paymentTypeId: [0],
      createdByUserText: [null],
      created: [null],
      customerId: [null],
      storeId: [null],
      supplierId: [null],
      customer: [null],
      customerText: [null],
      nhaCungCapMaNhaCungCapText: [null],
      nguoiNhan: [null],
      diaChi: [null],
      nhanVienId: [null],
      active: [null],
      maCoSo: [null],
      pickerFromDate: [null],
      pickerToDate: [null],
      fromDate: [null],
      toDate: [null],
      lastPaymentAmount: [null],
      lastDebtAmount: [null],
      editableStatus: [false],
      recordStatusId: [null],
      debtAmount: 0,
      returnAmount: 0,
      debtNotes: [[]],
      receiverNoteId: [0],
      receiverNoteIds: [[]],
      isPayByPeriod: [false],
    });
  }


  async ngOnInit() {
    this.getDataFilter();
    if (this.isCreateView()) {
      this.formData.patchValue({loaiPhieu: this.data.loaiPhieu});
      await this.getSoPhieuThuChi();
    }
    if (this.isUpdateView()) {
      const data = await this.detail(this.data.id);
      this.formData.patchValue(data);
      this.formData.patchValue({
        lastPaymentAmount: data.amount,
        pickerNgayTao: convertDateObject(data.ngayTao)
      });
      if (this.formData.value?.loaiPhieu == LOAI_THU_CHI.CHI_PHI_KINH_DOANH && this.formData.value?.fromDate && this.formData.value?.toDate) {
        this.formData.patchValue({
          isPayByPeriod: true,
          pickerFromDate: convertDateObject(this.formData.value?.fromDate),
          pickerToDate: convertDateObject(this.formData.value?.toDate),
        })
      }
    }
  }

  async getSoPhieuThuChi() {
    const body = {
      loaiPhieu: this.formData.value?.loaiPhieu,
    }
    let res = await this._service.getSoPhieuThuChi(body);
    if (res?.status == STATUS_API.SUCCESS) {
      this.formData.patchValue({
        soPhieu: res.data,
      });
    }
  }

  getDataFilter() {
    // Hình thức thanh toán
    this.paymentTypeService.searchList({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listPaymentType = res?.data;
      }
    });
    // Danh sách nhà thuốc quản lý
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
            maNhaThuoc: this.formData.value?.maCoSo,
          };
          console.log(body)
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
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'F1') {
      event.preventDefault();
      this.openNewTabAdd();
    }
    if (event.key === 'F9') {
      event.preventDefault();
      this.saveEdit().then(r => {
      });
    }
  }

  openNewTabAdd() {
    const url = this.location.prepareExternalUrl('/management/in-out-note/list');
    const params = `loaiPhieu=${this.formData.value?.loaiPhieu}&taoPhieu=${this.formData.value?.loaiPhieu}`;
    window.open(`${url}?${params}`, '_blank');
  }

  clearNhanVienId() {
    this.formData.patchValue({
      nhanVienId: null,
    });
  }

  isCreateView() {
    return !this.data.id;
  }

  isUpdateView() {
    return this.data.id;
  }

  async onPrint(printType: any) {

  }

  getMaNhaThuoc() {
    return this.authService?.getNhaThuoc()?.maNhaThuoc;
  }

  is9274() {
    return this.getMaNhaThuoc() == '9274';
  }

  isValidForm() {
    if (this.formData.value?.amount < 0.1) {
      this.notification.error(MESSAGE.ERROR, "Số tiền không hợp lệ!");
      return false;
    }
    if (this.is9274()) {
      if (this.formData.value?.maCoSo == null || this.formData.value?.maCoSo == '') {
        this.notification.error(MESSAGE.ERROR, "Chưa chọn cơ sở");
        return false;
      }
      if (this.formData.value?.nhanVienId == null) {
        this.notification.error(MESSAGE.ERROR, "Chưa chọn " + (this.formData.value?.loaiPhieu == LOAI_THU_CHI.THU_KHAC ? "người nộp" : "người nhận"));
        return false;
      }
    }
    if (this.formData.value?.isPayByPeriod) {
      if (this.formData.value?.pickerFromDate == null || this.formData.value?.pickerToDate == null) {
        this.notification.error(MESSAGE.ERROR, "Khoảng thời gian thanh toán theo kỳ không hợp lệ");
        return false;
      }

      const fromDate = new Date(this.formData.value?.pickerFromDate);
      const toDate = new Date(this.formData.value?.pickerToDate);
      if (fromDate > toDate) {
        this.notification.error(MESSAGE.ERROR, "Khoảng thời gian thanh toán theo kỳ không hợp lệ");
        return false;
      }
    }
    return true;
  }

  async saveEdit() {
    if (this.isValidForm()) {
      this.formData.patchValue({
        ngayTao: this.datePipe.transform(this.formData.value?.pickerNgayTao, 'dd/MM/yyyy HH:mm:ss'),
        fromDate: this.formData.value?.pickerFromDate ? this.datePipe.transform(this.formData.value?.pickerFromDate, 'dd/MM/yyyy HH:mm:ss') : null,
        toDate: this.formData.value?.pickerToDate ? this.datePipe.transform(this.formData.value?.pickerToDate, 'dd/MM/yyyy HH:mm:ss') : null,
      })
      if (Math.round(this.formData.value?.amount) == Math.round(this.formData.value?.debtAmount)) {
        this.formData.patchValue({
          amount: this.formData.value?.debtAmount,
        })
      }
      let body = this.formData.value;
      let data = await this.save(body);
      if (data) {
        this.closeModal(data);
      }
    }
  }

  override async delete() {
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: 'Bạn thực sự muốn xóa phiếu này?',
      okText: 'Đồng ý',
      cancelText: 'Không',
      okDanger: true,
      width: 310,
      onOk: async () => {
        this.service.delete({id: this.formData.value?.id}).then(async (res) => {
          if (res && res.data) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            this.closeModal(this.formData.value);
          }
        });
      },
    });
  }

  getTitle() {
    return this.listLoaiPhieu.find(x => x.id == this.formData.value?.loaiPhieu)?.name;
  }

  closeModal(data: any = null) {
    this.dialogRef.close(data);
  }

  protected readonly LOAI_THU_CHI = LOAI_THU_CHI;
}
