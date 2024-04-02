import {Component, Injector, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {BaseComponent} from "../../../component/base/base.component";
import {Router} from "@angular/router";
import {SpinnerService} from "../../../services/spinner.service";
import {NotificationService} from "../../../services/notification.service";
import {MESSAGE, STATUS_API} from "../../../constants/message";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";

@Component({
  selector: 'app-layout',
  templateUrl: './choose-nha-thuoc.component.html',
  styleUrls: ['./choose-nha-thuoc.component.css'],
})
export class ChooseNhaThuocComponent extends BaseComponent implements OnInit {
  private nhaThuoc: any = undefined;

  constructor(injector: Injector, private router: Router, private loadingService: SpinnerService, private authService: AuthService, private nhaThuocsService: NhaThuocsService, public notificationService: NotificationService) {
    super(injector, nhaThuocsService);
  }

  ngOnInit() {
    this.formData = this.fb.group({
      textSearch: [undefined],
    });
    this.searchPage();
  }

  async chooseNhaThuoc() {
    if (this.nhaThuoc) {
      this.loadingService.show();
      let res = await this.authService.chooseNhaThuoc({id: this.nhaThuoc.id});
      if (res && res.statusCode == 0) {
        this.authService.saveNhaThuoc(this.nhaThuoc);
        this.authService.saveUser(res.data);
        this.router.navigate(['management/home']).then(r => {
        });
        this.loadingService.hide();
      }
    } else {
      this.notificationService.error(MESSAGE.ERROR, "Chưa chọn cơ sở!");
    }

  }

  chooseRow(data: any) {
    this.nhaThuoc = data;
  }

  override async searchPage() {
    await this.spinner.show();
    try {
      let body = this.formData.value
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this.nhaThuocsService.searchPageNhaThuoc(body);
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
}
