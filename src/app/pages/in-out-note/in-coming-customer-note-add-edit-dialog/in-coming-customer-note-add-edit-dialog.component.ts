import {Component, HostListener, Inject, Injector, OnInit} from '@angular/core';
import {BaseComponent} from '../../../component/base/base.component';
import {PhieuThuChiService} from '../../../services/thuchi/phieu-thu-chi.service';
import {KhachHangService} from '../../../services/customer/khach-hang.service';
import {MESSAGE, STATUS_API} from '../../../constants/message';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LOAI_THU_CHI} from "../../../constants/config";
import {PaymentTypeService} from "../../../services/categories/payment-type.service";
import {convertDateObject} from "../../../utils/date.utils";
import {DatePipe} from "@angular/common";
import {
  OutReturnCustomerNoteAddEditDialogComponent
} from "../out-return-customer-note-add-edit-dialog/out-return-customer-note-add-edit-dialog.component";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";

@Component({
  selector: 'in-coming-customer-note-add-edit-dialog',
  templateUrl: './in-coming-customer-note-add-edit-dialog.component.html',
  styleUrls: ['./in-coming-customer-note-add-edit-dialog.component.css'],
})
export class InComingCustomerNoteAddEditDialogComponent extends BaseComponent implements OnInit {
  listPaymentType: any[] = [];
  listKhachHang$ = new Observable<any[]>;
  searchKhachHangTerm$ = new Subject<string>();
  // Settings
  // Authorities
  inOutComingNoteCreate = true;
  inOutComingNoteWrite = true;
  inOutComingNoteDelete = true;
  inOutComingNotePrint = true;

  constructor(
    injector: Injector,
    private _service: PhieuThuChiService,
    private khachHangService: KhachHangService,
    private paymentTypeService: PaymentTypeService,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<InComingCustomerNoteAddEditDialogComponent>,
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
      loaiPhieu: [LOAI_THU_CHI.THU_NO_KHACH_HANG],
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
      staffId: [null],
      active: [null],
      maCoSo: [null],
      fromDate: [null],
      toDate: [null],
      lastPaymentAmount: [null],
      lastDebtAmount: [null],
      editableStatus: [false],
      recordStatusId: [null],
      debtAmount: 0,
      returnAmount: 0,
      debtNotes: [[]],
      receiverNoteId: [null],
      receiverNoteIds: [[]],
    });
  }

  async ngOnInit() {
    this.getDataFilter();
    if (this.isCreateView()) {
      await this.getSoPhieuThuChi();
      if(this.data.customerId){
        let res = await this.khachHangService.getDetail(this.data.customerId);
        if (res?.status == STATUS_API.SUCCESS){
          this.formData.patchValue({
            customer: res.data
          });
        }
        this.formData.patchValue({
          customerId: this.data.customerId,
        });
        await this.onCustomerSelectedChange(this.formData.value.customer);
      }
    }
    if (this.isUpdateView()) {
      const data = await this.detail(this.data.id);
      this.formData.patchValue(data);
      this.formData.patchValue({
        lastPaymentAmount: data.amount,
        pickerNgayTao: convertDateObject(data.ngayTao)
      });
      await this.getDebtInfo();
      if (this.formData.value?.debtNotes?.length == 1) {
        this.formData.patchValue({
          lastDebtAmount: this.formData.value?.debtNotes[0]?.debtAmount + this.formData.value?.lastPaymentAmount,
          editableStatus: true
        })
      }
      this.isValidForm();
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

  async getDebtInfo() {
    const body = {
      id: this.formData.value?.id,
      customerId: this.formData.value?.customerId,
    }
    let res = await this._service.getInComingCustomerDebt(body);
    if (res?.status == STATUS_API.SUCCESS) {
      this.formData.patchValue(res.data);
    }
  }

  getDataFilter() {
    // Hình thức thanh toán
    this.paymentTypeService.searchList({}).then((res) => {
      if (res?.status == STATUS_API.SUCCESS) {
        this.listPaymentType = res?.data;
      }
    });
    //Search khách hàng
    this.listKhachHang$ = this.searchKhachHangTerm$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term: string) => {
        if (term.length >= 2) {
          let body = {
            textSearch: term,
            paggingReq: {limit: 25, page: 0},
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

  async onCustomerSelectedChange($event: any) {
    this.searchKhachHangTerm$.next('');
    if ($event) {
      await this.getDebtInfo();
      //Add bản ghi tất cả nếu debtNotes có từ 2 item
      if (this.formData.value?.debtNotes.length >= 2) {
        let debtAmount = 0;
        if(this.formData.value?.debtAmount - this.formData.value?.returnAmount > 0) {
          debtAmount = this.formData.value?.debtAmount - this.formData.value?.returnAmount;
        }
        this.formData.value?.debtNotes.unshift({
          id: 0,
          noteInfo: '--Tất cả--',
          debtAmount: debtAmount,
          returnAmount: this.formData.value?.returnAmount
        });
        this.formData.patchValue({
          receiverNoteIds: this.formData.value?.debtNotes
            .filter((item: any) => item.id != 0)
            .map((item: any) => item.id)
        })
      }
      // Select phiếu đầu tiên
      await this.onNoteSelectedChange(this.formData.value?.debtNotes[0]);
    } else {
      this.formData.patchValue({
        amount: 0,
        debtAmount: 0,
        returnAmount: 0,
        debtNotes: [],
        receiverNoteId: null
      });
    }
  }

  async onNoteSelectedChange($event: any) {
    if ($event) {
      this.formData.patchValue({
        debtAmount: $event.debtAmount,
        returnAmount: $event.returnAmount,
        receiverNoteId: $event.id
      });
      await this.onPayFull();
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key === 'F1') {
      event.preventDefault();
      this.openNewTabAdd();
    }
    if (event.key === 'F9') {
      event.preventDefault();
      this.saveEdit().then(r => {});
    }
  }

  openNewTabAdd() {
    const url = this.location.prepareExternalUrl('/management/in-out-note/list');
    const params = `loaiPhieu=${this.formData.value?.loaiPhieu}&taoPhieu=${this.formData.value?.loaiPhieu}`;
    window.open(`${url}?${params}`, '_blank');
  }

  isCreateView() {
    return !this.data.id;
  }

  isUpdateView() {
    return this.data.id;
  }

  getChiTiets() {
    let chiTiets = '';
    this.formData.value?.debtNotes?.forEach((detail: any) => {
      if (detail.id) chiTiets += `${detail?.noteInfo}<br>`;
    });
    return chiTiets;
  }

  async onPayFull() {
    if (this.formData.value.editableStatus) {
      this.formData.patchValue({
        amount: this.formData.value?.lastDebtAmount,
      })
    } else {
      this.formData.patchValue({
        amount: this.formData.value?.debtAmount,
      })
    }
  }

  async onPrint(printType: any) {

  }

  isValidForm() {
    if(this.formData.value?.amount < 0.1 || this.formData.value?.debtAmount <= 0.1) {
      this.notification.error(MESSAGE.ERROR, "Số tiền trả không hợp lệ!");
      return false;
    }
    if (this.isCreateView()) {
      if (Math.round(this.formData.value?.amount) > Math.round(this.formData.value?.debtAmount)) {
        this.notification.error(MESSAGE.ERROR, "Số tiền trả không được vượt quá số tiền nợ. \nVui lòng nhập lại số tiền trả thấp hơn!");
        return false;
      }
    }
    if (this.isUpdateView()) {
      if(!this.formData.value?.editableStatus) {
        this.notification.error(MESSAGE.ERROR, 'Bạn không được sửa phiếu này do phiếu này trả cho nhiều phiếu. Bạn chỉ có thể xóa phiếu này đi', 10000);
        return false;
      }
      if (Math.round(this.formData.value?.amount) > Math.round(this.formData.value?.lastDebtAmount)) {
        this.notification.error(MESSAGE.ERROR, "Số tiền trả không được vượt quá số tiền nợ là " + this.formData.value?.lastDebtAmount + ". \nVui lòng nhập lại số tiền trả thấp hơn!");
        return false;
      }
    }
    return true;
  }

  async saveEdit() {
    if(this.isValidForm()){
      this.formData.patchValue({
        ngayTao: this.datePipe.transform(this.formData.value?.pickerNgayTao, 'dd/MM/yyyy HH:mm:ss'),
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

  async openAddEditOutReturnCustomerNoteAddEditDialog() {
    this.closeModal();
    const config = {
      data: {
        customerId: this.formData.value?.customerId
      },
      width: '600px',
    };
    this.dialog.open(OutReturnCustomerNoteAddEditDialogComponent, config);
  }

  closeModal(data: any = null) {
    this.dialogRef.close(data);
  }

  protected readonly LOAI_THU_CHI = LOAI_THU_CHI;
}
