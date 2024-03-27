import {Component, Injector, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {BaseComponent} from "../../../component/base/base.component";

@Component({
  selector: 'app-layout',
  templateUrl: './choose-nha-thuoc.component.html',
  styleUrls: ['./choose-nha-thuoc.component.css'],
})
export class ChooseNhaThuocComponent extends BaseComponent implements OnInit {
  constructor(injector: Injector, private authService: AuthService) {
    super(injector, authService);
  }

  ngOnInit() {
  }

  chooseNhaThuoc() {

  }

  chooseRow(data: any) {
      console.log(data)
  }
}
