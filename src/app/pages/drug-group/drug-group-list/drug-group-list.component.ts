import {Component, Injectable, Injector, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {NhomThuocService} from "../../../services/categories/nhom-thuoc.service";
import {BaseComponent} from "../../../base/base.component";
import {Validators} from "@angular/forms";

@Component({
  selector: 'drug-group-list',
  templateUrl: './drug-group-list.component.html',
  styleUrls: ['./drug-group-list.component.css'],
})
export class DrugGroupListComponent extends BaseComponent implements OnInit {
  title: string = "Danh sách nhóm thuốc";
  drugGroupID: number = 0;

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service : NhomThuocService
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
      // UserName: ['', Validators.required],
      // Password: ['', Validators.required],
      // // code: ['', Validators.required],
      // // captchaText: ['', Validators.required],
      // code: [],
      // captchaText: [],
      // rememberMe: [''],
    });
  }

  ngOnInit() {
    console.log("sadasdsa")
    this.searchList()
    this.titleService.setTitle(this.title);
  }
}

