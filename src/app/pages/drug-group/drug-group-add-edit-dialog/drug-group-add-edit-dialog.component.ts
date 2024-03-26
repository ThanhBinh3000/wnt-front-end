import {Component, Injector, Input, OnInit} from '@angular/core';
import {BaseComponent} from "../../../component/base/base.component";
import {Title} from "@angular/platform-browser";
import {NhomThuocService} from "../../../services/categories/nhom-thuoc.service";
import {Validators} from "@angular/forms";

@Component({
  selector: 'drug-group-add-edit-dialog',
  templateUrl: './drug-group-add-edit-dialog.component.html',
  styleUrls: ['./drug-group-add-edit-dialog.component.css'],
})
export class DrugGroupAddEditDialogComponent extends BaseComponent implements OnInit  {
  @Input() drugGroupID: number = 0;

  constructor(
    injector: Injector,
    private _service : NhomThuocService
  ) {
    super(injector,_service);
    this.formData = this.fb.group({
      tenNhomThuoc: ['', Validators.required],
      kyHieuNhomThuoc : ['']
    });
  }

  ngOnInit() {

  }

  async saveEdit(){
    let body = this.formData.value;
    console.log(body)
    let data = await this.save(body,false);
    console.log(data)
  }


}
