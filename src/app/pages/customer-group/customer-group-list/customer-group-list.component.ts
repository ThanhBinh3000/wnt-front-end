import {Component, Injector, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {NhomKhachHangService} from "../../../services/categories/nhom-khach-hang.service";
import {BaseComponent} from "../../../component/base/base.component";
import {MatDialog} from "@angular/material/dialog";
import {
  CustomerGroupAddEditDialogComponent
} from "../customer-group-add-edit-dialog/customer-group-add-edit-dialog.component";

@Component({
  selector: 'customer-group-list',
  templateUrl: './customer-group-list.component.html',
  styleUrls: ['./customer-group-list.component.css'],
})
export class CustomerGroupListComponent extends BaseComponent implements OnInit {
  title: string = "Danh sách nhóm khách hàng";
  customerGroupID: number = -1;
  modalShow: string[] = [];

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: NhomKhachHangService,
    private dialog: MatDialog
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

  openModal(modalName: string, id: any) {
    this.modalShow.push(modalName);
    this.customerGroupID = id;
  }

  closeModal(modalName: string) {
    this.modalShow = this.modalShow.filter(item => item !== modalName);
    this.searchPage();
  }

  isShowModal(modalName: string) {
    return this.modalShow.includes(modalName);
  }

  openDialog(customerGroupID: any): void {
    const dialogRef = this.dialog.open(CustomerGroupAddEditDialogComponent, {
      data: customerGroupID,
      width: '30%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }
}
