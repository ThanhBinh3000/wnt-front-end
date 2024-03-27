import {Component, Injectable, Injector, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {NhomThuocService} from "../../../services/categories/nhom-thuoc.service";
import {BaseComponent} from "../../../component/base/base.component";
import {Validators} from "@angular/forms";
import {DrugGroupAddEditDialogComponent} from "../drug-group-add-edit-dialog/drug-group-add-edit-dialog.component";

@Component({
  selector: 'drug-group-list',
  templateUrl: './drug-group-list.component.html',
  styleUrls: ['./drug-group-list.component.css'],
})
export class DrugGroupListComponent extends BaseComponent implements OnInit {
  title: string = "Danh sách nhóm thuốc";
  drugGroupId: number = -1;
  @ViewChild('buttonModal') buttonModal;

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service : NhomThuocService
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
      tenNhomThuoc : [],
    });
  }

  ngOnInit() {
    this.searchPage()
    this.titleService.setTitle(this.title);
  }

  closeModal($event){
    console.log('close',$event);
  }

  openModal($event){
    this.drugGroupId = $event
    // this.closeButton.nativeElement.click();
    this.buttonModal.nativeElement.click();
  }
}

