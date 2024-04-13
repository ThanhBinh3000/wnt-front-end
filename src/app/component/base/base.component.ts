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
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";


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
  dataSource = new MatTableDataSource();
  dataTable: any[] = [];
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  totalPages: number = 0;
  fb: FormBuilder = new FormBuilder();
  // dialog2: MatDialog = new MatDialog();

  // Service
  notification: NotificationService;
  userService: UserService;
  httpClient: HttpClient;
  storageService: StorageService;
  injector: Injector;
  service: BaseService;
  spinner: SpinnerService;
  modal: ModalService;
  dialog : MatDialog;
  helperService: HelperService

  allChecked = false;
  indeterminate = false;

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
    this.dialog = this.injector.get(MatDialog);
  }

  getDataSource(){
    this.dataSource.data = this.dataTable;
    return this.dataSource;
  }

  // search page
  async searchPage() {
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
    }
  }

  // search list
  async searchList() {
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
    try {
      this.pageSize = event;
      this.searchPage();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  async changePageIndex(event: any) {
    try {
      this.page = event;
      this.searchPage();
    } catch (e) {
      this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
  }

  // DELETE 1 item table
  delete(message: string, item: any) {
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
          this.service.delete(body).then(async (res) => {
            if(res && res.data){
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.searchPage();
            }
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  deleteDatabase(message: string, item: any) {
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
          this.service.deleteDatabase(body).then(async (res) => {
            if(res && res.data) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.searchPage();
            }
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }

  restore(message: string, item: any) {
    console.log(message,item);
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: !message ? 'Bạn có chắc chắn muốn khôi phục ?' : message,
      okText: 'Đồng ý',
      cancelText: 'Không',
      okDanger: true,
      width: 310,
      onOk: async () => {
        try {
          let body = {
            id : item.id
          }
          this.service.restore(body).then(async (res) => {
            if(res && res.data){
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.RESTORE_SUCCESS);
              await this.searchPage();
              this.spinner.hide();
            }
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
  deleteMulti(message?: string) {
    let dataDelete : any[] = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push(item.id);
        }
      });
    }
    if (dataDelete && dataDelete.length > 0) {
      this.modal.confirm({
        closable: false,
        title: 'Xác nhận',
        content: !message ? 'Bạn có chắc chắn muốn xóa ?' : message,
        okText: 'Đồng ý',
        cancelText: 'Không',
        okDanger: true,
        width: 310,
        onOk: async () => {
          let res = await this.service.deleteMultiple({listIds: dataDelete});
          if (res && res.data) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            await this.searchPage();
          }
        },
      });
    } else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để xóa.");
    }
  }

  restoreMulti(message?: string) {
    console.log('deletee');
    let dataDelete : any[] = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push(item.id);
        }
      });
    }
    if (dataDelete && dataDelete.length > 0) {
      this.modal.confirm({
        closable: false,
        title: 'Xác nhận',
        content: !message ? 'Bạn có chắc chắn muốn khôi phục ?' : message,
        okText: 'Đồng ý',
        cancelText: 'Không',
        okDanger: true,
        width: 310,
        onOk: async () => {
          let res = await this.service.restoreMultiple({listIds: dataDelete});
          if (res && res.data) {
            this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
            await this.searchPage();
          }
        },
      });
    } else {
      this.notification.error(MESSAGE.ERROR, "Không có dữ liệu phù hợp để khôi phục.");
    }
  }

  deleteMultiDatabase(message?: string) {
    let dataDelete : any[] = [];
    if (this.dataTable && this.dataTable.length > 0) {
      this.dataTable.forEach((item) => {
        if (item.checked) {
          dataDelete.push(item.id);
        }
      });
    }
    if (dataDelete && dataDelete.length > 0) {
      this.modal.confirm({
        closable: false,
        title: 'Xác nhận',
        content: !message ? 'Bạn có chắc chắn muốn xóa ?' : message,
        okText: 'Đồng ý',
        cancelText: 'Không',
        okDanger: true,
        width: 310,
        onOk: async () => {
          let res = await this.service.deleteMultipleDatabase({listIds: dataDelete});
          if (res && res.data) {
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
        return res.data;
      } else {
        this.notification.success(MESSAGE.SUCCESS, MESSAGE.ADD_SUCCESS);
        return res.data;
      }
    }
  }

  async detail(id:number) {
    if(id){
      let res = await this.service.getDetail(id);
      if(res?.statusCode == STATUS_API.SUCCESS){
        const data = res.data;
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

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
            item.checked = true;
        });
      }
    } else {
      if (this.dataTable && this.dataTable.length > 0) {
        this.dataTable.forEach((item) => {
          item.checked = false;
        });
      }
    }
  }

  updateSingleChecked(): void {
    if (this.dataTable.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (this.dataTable.every((item) => item.checked)) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }
}
t
