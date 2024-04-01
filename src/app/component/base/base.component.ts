import {Component, Injector, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
// @ts-ignore
import {saveAs} from 'file-saver';
import {HttpClient} from '@angular/common/http';
import {Department} from "../../models/department";
import {UserService} from "../../services/user.service";
import {UserLogin} from "../../models/user-login";
import {PAGE_SIZE_DEFAULT} from "../../constants/config";
import {MESSAGE, STATUS_API} from "../../constants/message";
import {StorageService} from "../../services/storage.service";
import {BaseService} from "../../services/base.service";
import {NotificationService} from "../../services/notification.service";
import {SpinnerService} from "../../services/spinner.service";
import {ModalService} from "../../services/modal.service";
import {HelperService} from "../../services/helper.service";


@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
})
export class BaseComponent  {
  // User Info
  userInfo: UserLogin;
  department: Department;
  // @ts-ignore
  formData: FormGroup;
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  totalPages: number = 0;
  fb: FormBuilder = new FormBuilder();


  // Service
  notification: NotificationService;
  userService: UserService;
  httpClient: HttpClient;
  storageService: StorageService;
  injector: Injector;
  service: BaseService;
  spinner: SpinnerService;
  modal: ModalService;

  helperService: HelperService

  constructor(
    injector: Injector,
    service: BaseService
  ) {
    this.injector = injector;
    this.service = service
    this.spinner = this.injector.get(SpinnerService);
    this.modal = this.injector.get(ModalService);
    this.httpClient = this.injector.get(HttpClient);
    this.storageService = this.injector.get(StorageService);
    this.userService = this.injector.get(UserService);
    this.notification = this.injector.get(NotificationService);
    this.helperService = this.injector.get(HelperService);
    // get user info login
    this.userInfo = this.userService.getUserLogin();
    this.department = this.userInfo.department;
  }

  // search page
  async searchPage() {
    await this.spinner.show();
    try {
      let body = this.formData.value
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this.service.searchPage(body);
      if (res?.statusCode == STATUS_API.SUCCESS) {
        let data = res.data;
        this.dataTable = data.content;
        this.totalRecord = data.totalElements;
        this.totalPages = data.totalPages;

      } else {
        this.dataTable = [];
        this.totalRecord = 0;
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  // search list
  async searchList() {
    await this.spinner.show();
    try {
      let body = this.formData.value
      let res = await this.service.searchList(body);
      if (res?.statusCode == STATUS_API.SUCCESS) {
        this.dataTable = res.data;
        if (this.dataTable && this.dataTable.length > 0) {
          this.dataTable.forEach((item) => {
            item.checked = false;
          });
        }
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    } finally {
      await this.spinner.hide();
    }
  }

  // clear form data
  clearFormData() {
    this.formData.reset();
  }

  async changePageSize(event: any) {
    this.spinner.show();
    try {
      this.pageSize = event;
      this.searchPage();
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageIndex(event: any) {
    this.spinner.show();
    try {
      this.page = event;
      this.searchPage();
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  // getPages(): number[] {
  //   const totalPagesToShow = 9; // Số trang hiển thị tối đa
  //   const pages : number[] = [];
  //   const half = Math.floor(totalPagesToShow / 2);
  //
  //   let start = this.page - half;
  //   let end = this.page + half;
  //
  //   if (start <= 0) {
  //     start = 1;
  //     end = totalPagesToShow;
  //   }
  //
  //   if (end > this.totalPages) {
  //     end = this.totalPages;
  //     start = this.totalPages - totalPagesToShow + 1;
  //     if (start <= 0) {
  //       start = 1;
  //     }
  //   }
  //
  //   for (let i = start; i <= end; i++) {
  //     pages.push(i);
  //   }
  //   return pages;
  // }

  // DELETE 1 item table
  delete(message: string, item: any) {
    this.spinner.show();
    console.log(message,item);
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: !message ? 'Bạn có chắc chắn muốn xóa?' : message,
      okText: 'Đồng ý',
      cancelText: 'Không',
      okDanger: true,
      width: 310,
      onOk: async () => {
        try {
          let body = {
            id : item.id
          }
          this.service.delete(body).then(async () => {
            await this.searchPage();
            this.spinner.hide();
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  // DELETE 1 multi
  deleteMulti(message: string, item: any[]) {
    let dataDelete: number[] = [];
    if (item && item.length > 0) {
      item.forEach((item) => {
        dataDelete.push(item.id);
      });
    }
    if (dataDelete && dataDelete.length > 0) {
      this.modal.confirm({
        closable: false,
        title: 'Xác nhận',
        content: !message ? 'Bạn có chắc chắn muốn xóa?' : message,
        okText: 'Đồng ý',
        cancelText: 'Không',
        okDanger: true,
        width: 310,
        onOk: async () => {
          this.spinner.show();
          let res = await this.service.deleteMultiple(dataDelete);
          if (res && res.msg == MESSAGE.SUCCESS) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            await this.searchPage();
          }
        },
      });
    } else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  // Export data
  export(fileName: string) {
    if (this.totalRecord > 0) {
      this.service
        .export(this.formData.value)
        .subscribe((blob) =>
          saveAs(blob, fileName),
        );
    } else {
      this.notification.error(MESSAGE.ERROR, MESSAGE.DATA_EMPTY);
    }
  }

  // init
  init() {

  }

  // Save
  async save(body: any) {
    this.spinner.show();
    this.markFormGroupTouched(this.formData);
    if (this.formData.invalid) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return;
    }
    let res;
    if (body.id && body.id > 0) {
      res = await this.service.update(body);
    } else {
      res = await this.service.create(body);
    }
    console.log(res);
    if (res && res.statusCode == STATUS_API.SUCCESS) {
      if (body.id && body.id > 0) {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.UPDATE_SUCCESS);
        this.spinner.hide();
        return res.data;
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        this.spinner.hide();
        return res.data;
      }
    }
  }

  async detail(id:number) {
    if(id){
      let res = await this.service.getDetail(id);
      console.log(res);
      if(res?.statusCode == STATUS_API.SUCCESS){
        const data = res.data;
        console.log(data);
        return data;
      } else {
        return null;
      }
    }
  }

  // Approve
  async approve(id: number, status: string, msg: string,) {

  }

  async markFormGroupTouched(formGroup: FormGroup, ignoreFields: Array<string> = []) {
    for (const i in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(i) && formGroup.controls[i].enabled && !ignoreFields.includes(i)) {
        formGroup.controls[i].markAsDirty();
        formGroup.controls[i].updateValueAndValidity();
      }
    }
    this.findInvalidControls(formGroup);
  }

  findInvalidControls(formData: FormGroup) {
    const invalid: string[] = [];
    const controls = formData.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    if (invalid.length > 0) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      console.log(invalid, ' invalid');
    }
  }
}
