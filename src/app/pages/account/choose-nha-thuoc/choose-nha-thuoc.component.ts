import {Component, Injector, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {BaseComponent} from "../../../component/base/base.component";
import {Router} from "@angular/router";
import {SpinnerService} from "../../../services/spinner.service";
import {NotificationService} from "../../../services/notification.service";
import {MESSAGE} from "../../../constants/message";
import {NhaThuocsService} from "../../../services/system/nha-thuocs.service";

@Component({
  selector: 'app-layout',
  templateUrl: './choose-nha-thuoc.component.html',
  styleUrls: ['./choose-nha-thuoc.component.css'],
})
export class ChooseNhaThuocComponent extends BaseComponent implements OnInit {
  private nhaThuocId: any = undefined;
  constructor(injector: Injector, private router: Router, private loadingService: SpinnerService, private authService: AuthService, private nhaThuocsService: NhaThuocsService, public notificationService: NotificationService) {
    super(injector, nhaThuocsService);
  }

  ngOnInit() {
    this.formData = this.fb.group({
      searchTen: [undefined],
    });
    this.searchPage();
  }

  async chooseNhaThuoc() {
    console.log('chooseNhaThuoc');
    if (this.nhaThuocId) {
      this.loadingService.show();
      let res = await this.authService.chooseNhaThuoc({id: this.nhaThuocId});
      if (res && res.statusCode == 0) {
        this.authService.saveNhaThuoc({id: this.nhaThuocId});
        this.router.navigate(['management/home']).then(r => {
          this.notificationService.close();
        });
        this.loadingService.hide();
      }
    } else {
      this.notificationService.error(MESSAGE.ERROR, "Chưa chọn cơ sở!");
    }

  }

  chooseRow(data: any) {
    console.log(data);
    this.nhaThuocId = data.id;
  }
}
