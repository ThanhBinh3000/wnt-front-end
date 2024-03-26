import {Component, Injector, Input, OnInit} from '@angular/core';
import {NhomKhachHangService} from "../../../services/categories/nhom-khach-hang.service";
import {Validators} from "@angular/forms";
import {BaseComponent} from "../../../component/base/base.component";

@Component({
  selector: 'customer-group-add-edit-dialog',
  templateUrl: './customer-group-add-edit-dialog.component.html',
  styleUrls: ['./customer-group-add-edit-dialog.component.css'],
})
export class CustomerGroupAddEditDialogComponent extends BaseComponent implements OnInit {
  @Input() customerGroupID: number = 0;

  constructor(
    injector: Injector,
    private _service : NhomKhachHangService
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
      tenNhomKhachHang: ['', Validators.required],
      ghiChu : ['']
    });
  }

  ngOnInit() {

  }

  async saveEdit(){
    let body = this.formData.value;
    console.log(body)
    let data = await this.save(body,this.customerGroupID > 0);
    console.log(data)
  }
}
