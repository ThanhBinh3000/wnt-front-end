import {Component, Injector, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {NhomKhachHangService} from "../../../services/categories/nhom-khach-hang.service";
import {BaseComponent} from "../../../component/base/base.component";

@Component({
  selector: 'customer-group-list',
  templateUrl: './customer-group-list.component.html',
  styleUrls: ['./customer-group-list.component.css'],
})
export class CustomerGroupListComponent extends BaseComponent implements OnInit {
  title: string = "Danh sách nhóm khách hàng";
  customerGroupID: number = 0;

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: NhomKhachHangService
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
      searchText : '',
    });
  }

  ngOnInit() {
    this.searchPage();
    this.titleService.setTitle(this.title);
  }
}
