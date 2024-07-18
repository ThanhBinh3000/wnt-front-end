import {Component, Inject, Injector, Input, OnInit} from '@angular/core';
import {BaseComponent} from "../../../component/base/base.component";
import {PhieuKhamService} from "../../../services/medical/phieu-kham.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {KhachHangService} from "../../../services/customer/khach-hang.service";
import {AppDatePipe} from "../../../component/pipe/app-date.pipe";
import {TRANG_THAI_PHIEU_KHAM} from "../../../constants/config";
import {catchError, debounceTime, distinctUntilChanged, from, Observable, of, Subject, switchMap} from "rxjs";
import {Validators} from "@angular/forms";
import {
  CustomerAddEditDialogComponent
} from "../../customer/customer-add-edit-dialog/customer-add-edit-dialog.component";

@Component({
  selector: 'medical-note-wait-add-edit-dialog',
  templateUrl: './medical-note-wait-add-edit-dialog.component.html',
  styleUrls: ['./medical-note-wait-add-edit-dialog.component.css'],
})
export class MedicalNoteWaitAddEditDialogComponent extends BaseComponent implements OnInit {
  listKhachHang$ = new Observable<any[]>;
  searchKhachHangTerm$ = new Subject<string>();
  // Settings
  // Authorities
  waitNotePrint = true;
  isWaitList: boolean = false;

  constructor(
    injector: Injector,
    private _service: PhieuKhamService,
    private khachHangService: KhachHangService,
    private appDatePipe: AppDatePipe,
    public dialogRef: MatDialogRef<MedicalNoteWaitAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [null],
      orderWait: [null],
      noteNumber: [0],
      idPatient: [null, Validators.required],
      reasonExamination: [null],
      heartbeat: [null],
      temperature: [null],
      weight: [null],
      bloodPressure: [null],
      breathing: [null],
      height: [null],
      customer: [null],
      statusNote: [0],
      recordStatusId: [0],
      isDeb: [true],
      storeCode: [this.authService.getNhaThuoc()?.maNhaThuoc]
    });
  }

  async ngOnInit() {
    this.getDataFilter();
    this.isWaitList = this.data.isWaitList;
    if (this.data.id) {
      const data = await this.detail(this.data.id);
      if (data) {
        this.formData.patchValue(data);
      }
    } else {
      await this.getNewNoteWaitNumber();
    }
  }

  getDataFilter() {
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

  onKhachHangSelectChange($event: any) {
    this.formData.patchValue({
      customer: $event
    })
  }

  calculateAge(dateString: string): number {
    // Chuyển chuỗi ngày sinh sang Date object
    const birthDate = new Date(this.appDatePipe.transform(dateString, 'yyyy-MM-ddTHH:mm:ss'));
    const today = new Date();

    // Tính số năm chênh lệch giữa năm hiện tại và năm sinh
    let age = today.getFullYear() - birthDate.getFullYear();

    // Kiểm tra xem tháng/ngày của năm hiện tại có trùng hoặc vượt quá tháng/ngày của năm sinh không
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    // Điều chỉnh tuổi nếu sinh nhật của người đó chưa đến trong năm nay
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--;
    }

    return age;
  }

  async getNewNoteWaitNumber() {
    let res = await this._service.getNewNoteWaitNumber();
    if(res?.status == STATUS_API.SUCCESS){
      this.formData.patchValue({
        orderWait: res.data
      });
    }
  }

  async onPrint() {

  }

  async openAddEditCustomerDialog(customer: any) {
    const dialogRef = this.dialog.open(CustomerAddEditDialogComponent, {
      data: {...customer, isMinimized: true},
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.formData.patchValue({
          customer: result,
          idPatient: result.id
        });
      }
    });
  }

  override async save(body: any): Promise<any> {
    this.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      //this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return;
    }
    let res;
    if (body.id && body.id > 0) {
      res = await this._service.updateNoteWait(body);
    } else {
      res = await this._service.createNoteWait(body);
    }
    if (res && res.status == STATUS_API.SUCCESS) {
      if (body.id && body.id > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        return res.data;
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        return res.data;
      }
    }
  }

  async saveEdit() {
    let body = this.formData.value;
    let data = await this.save(body);
    if (data) {
      this.dialogRef.close(data);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }

  protected readonly TRANG_THAI_PHIEU_KHAM = TRANG_THAI_PHIEU_KHAM;
}
