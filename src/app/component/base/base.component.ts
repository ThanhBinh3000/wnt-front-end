import {Component, Injector, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
// @ts-ignore
import {saveAs} from 'file-saver';
import {HttpClient} from '@angular/common/http';
import {Department} from "../../models/department";
import {UserService} from "../../services/user.service";
import {UserLogin} from "../../models/user-login";
import {DATE_RANGE, PAGE_SIZE_DEFAULT} from "../../constants/config";
import {MESSAGE, STATUS_API} from "../../constants/message";
import {StorageService} from "../../services/storage.service";
import {BaseService} from "../../services/base.service";
import {NotificationService} from "../../services/notification.service";
import {SpinnerService} from "../../services/spinner.service";
import {ModalService} from "../../services/modal.service";
import {HelperService} from "../../services/helper.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {AuthService} from "../../services/auth.service";
import {ActivatedRoute, NavigationExtras, Router} from "@angular/router";
import {Location} from "@angular/common";
import {DeviceService} from "../../services/device.service";
import printJS from "print-js";


@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
})
export class BaseComponent {
  // User Info
  userInfo: any;
  department: Department;
  // @ts-ignore
  formData: FormGroup;
  dataSource = new MatTableDataSource();
  dataTable: any[] = [];
  dataDetail: any;
  page: number = 1;
  pageSize: number = PAGE_SIZE_DEFAULT;
  totalRecord: number = 0;
  totalPages: number = 0;
  fb: FormBuilder = new FormBuilder();
  // dialog2: MatDialog = new MatDialog();

  // Service
  notification: NotificationService;
  device: DeviceService;
  userService: UserService;
  httpClient: HttpClient;
  storageService: StorageService;
  injector: Injector;
  service: BaseService;
  spinner: SpinnerService;
  modal: ModalService;
  dialog: MatDialog;
  helperService: HelperService

  allChecked = false;
  indeterminate = false;

  authService: AuthService;
  router: Router
  route: ActivatedRoute
  idUrl: number = 0;

  location: Location
  printSrc: any;
  pdfSrc: any;
  showDlgPreview = false;
  PATH_PDF = 'data:application/pdf;base64,';
  protected readonly DATE_RANGE = DATE_RANGE;

  selectedFile: File | null = null;
  dataImport: any;
  listDataDetail: any[] = [];

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
    this.device = this.injector.get(DeviceService);
    this.helperService = this.injector.get(HelperService);
    // get user info login
    this.authService = this.injector.get(AuthService);
    this.userInfo = this.authService.getUser();
    this.department = this.userInfo.department;
    this.dialog = this.injector.get(MatDialog);
    this.router = this.injector.get(Router);
    this.route = this.injector.get(ActivatedRoute);
    this.location = this.injector.get(Location);
  }

  getDataSource() {
    this.dataSource.data = this.dataTable;
    return this.dataSource;
  }

  getId() {
    let id = this.route.snapshot.paramMap.get('id');
    if (id && +id > 0) {
      this.idUrl = +id
    }
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
      if (res?.status == STATUS_API.SUCCESS) {
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
      if (res?.status == STATUS_API.SUCCESS) {
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

  async changeFilterType($event: any) {
    if ($event.filterType === DATE_RANGE.ALL) {
      this.formData.removeControl($event.fromDateControl);
      this.formData.removeControl($event.toDateControl);
      this.updateQueryParams($event.fromDateControl, null);
    } else {
      this.formData.addControl($event.fromDateControl, this.fb.control(''));
      this.formData.addControl($event.toDateControl, this.fb.control(''));
    }
  }

  async changeFromDate($event: any) {
    this.formData.get($event.fromDateControl)?.setValue($event.fromDate);
  }

  async changeToDate($event: any) {
    this.formData.get($event.toDateControl)?.setValue($event.toDate);
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
            id: item.id
          }
          this.service.delete(body).then(async (res) => {
            if (res && res.data) {
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

  // DELETE 1 item in view or edit
  deleteInView(message: string, item: any, url: string) {
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
            id: item.id
          }
          this.service.delete(body).then(async (res) => {
            if (res && res.data) {
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.router.navigate([url]);
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
    console.log(message, item);
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
            id: item.id
          }
          this.service.deleteDatabase(body).then(async (res) => {
            if (res && res.data) {
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
    console.log(message, item);
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
            id: item.id
          }
          this.service.restore(body).then(async (res) => {
            if (res && res.data) {
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
    let dataDelete: any[] = [];
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
    let dataDelete: any[] = [];
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
    let dataDelete: any[] = [];
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
      //this.notification.error(MESSAGE.ERROR, MESSAGE.FORM_REQUIRED_ERROR);
      return;
    }
    let res;
    if (body.id && body.id > 0) {
      res = await this.service.update(body);
    } else {
      res = await this.service.create(body);
    }
    console.log(res);
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

  async detail(id: number) {
    if (id) {
      let res = await this.service.getDetail(id);
      if (res?.status == STATUS_API.SUCCESS) {
        return res.data;
      } else {
        return null;
      }
    }
  }

  async approve(code: string, item: any) {
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: `Phiếu có mã số '${code}' sẽ được phê duyệt để đưa vào hệ thống. Bạn thực sự muốn tiếp tục?`,
      okText: 'Đồng ý',
      cancelText: 'Không',
      okDanger: true,
      width: 310,
      onOk: async () => {
        this.service.approve({id: item.id}).then(async (res) => {
          if (res && res.data) {
            this.notification.success(MESSAGE.SUCCESS, `Phiếu có mã số '${code}' đã được phê duyệt và đưa vào hệ thống.`);
            await this.searchPage();
          }
        });
      },
    });
  }

  async cancel(code: string, item: any) {
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: `Phiếu có mã số '${code}' sẽ bị hủy. Bạn thực sự muốn tiếp tục?`,
      okText: 'Đồng ý',
      cancelText: 'Không',
      okDanger: true,
      width: 310,
      onOk: async () => {
        this.service.cancel({id: item.id}).then(async (res) => {
          if (res && res.data) {
            this.notification.success(MESSAGE.SUCCESS, `Phiếu có mã số '${code}' đã bị hủy.`);
            await this.searchPage();
          }
        });
      },
    });
  }

  async lockUnlock(item: any) {
    const res = item.locked ? await this.service.unlock(item) : await this.service.lock(item);
    if (res && res.status == STATUS_API.SUCCESS) {
      item.locked = res.data.locked;
      this.notification.success(MESSAGE.SUCCESS, item.locked ? "Phiếu đã được khóa" : "Phiếu đã được mở");
    }
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

  goBack() {
    this.location.back();
  }

  goToUrl(url: any, id?: any) {
    this.router.navigate([url, id]);
  }

  isMobile() {
    return this.device.isMobile();
  }

  isTablet() {
    return this.device.isTablet();
  }

  isDesktop() {
    return this.device.isDesktop();
  }

  async printPreview(loai?: string, id?: number) {
    const validId = id ?? this.idUrl;
    if (validId && validId > 0) {
      let res = await this.service.preview({
        loai: loai,
        id: validId,
      });
      if (res?.data) {
        this.printSrc = res.data.pdfSrc;
        this.pdfSrc = this.PATH_PDF + res.data.pdfSrc;
        this.showDlgPreview = true;
        printJS({printable: this.printSrc, type: 'pdf', base64: true})
      } else {
        this.notification.error(MESSAGE.ERROR, "Lỗi trong quá trình tải file.");
      }
    }
  }

  async getQueryParams(param: string) {
    return this.route.snapshot.queryParamMap.get(param);
  }

  async updateQueryParams(param: string, value: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {[param]: value},
      queryParamsHandling: 'merge'
    };
    await this.router.navigate([], navigationExtras);
  }

  async removeQueryParams(param: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: {[param]: null},
      queryParamsHandling: 'merge'
    };
    await this.router.navigate([], navigationExtras);
  }

  async onFileSelected(event: any) {
    await this.spinner.show();
    this.selectedFile = event.target.files[0] as File;
    if (await this.isExcelFile(this.selectedFile)) {
      await this.uploadFile();
      await this.spinner.hide();
    } else {
      await this.spinner.hide();
      this.notification.error(MESSAGE.ERROR, 'Chọn file đuôi .xlsx');
    }
  }

  async isExcelFile(file: File) {
    const allowedExtensions = ['.xlsx'];
    const fileName = file.name.toLowerCase();

    return allowedExtensions.some(ext => fileName.endsWith(ext));
  }

  async uploadFile() {
    if (this.selectedFile) {
      const formData = new FormData();
      Object.keys(this.formData.value).forEach(key => {
        formData.append(key, this.formData.value[key]);
      });
      formData.append('file', this.selectedFile);
      await this.service.import(formData).then((res: any) => {
        if (res.message == MESSAGE.SUCCESS) {
          console.log(res.data, "res.data")
          this.dataImport = res.data
          console.log(this.dataImport, "this.dataImport")
        }
      })
    }
  }

  async handleSelectFile(event: Event) {
    await this.onFileSelected(event);
    await this.searchPage()
  }

  havePermissions(permissions: string[]){
    return permissions.some((code:any) => this.userInfo.authorities.some((auth:any) => auth.authority === code));
  }

  haveRoles(roles: string[]){
    return roles.some((code:any) => this.userInfo.roles.some((role:any) => role.roleName === code));
  }
}

