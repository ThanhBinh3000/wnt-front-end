import {Component, Inject, Injector, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BankAccountService} from "../../../../services/categories/bank-account.service";
import {BaseComponent} from "../../../../component/base/base.component";
import {Validators} from "@angular/forms";
import {BanksService} from "../../../../services/categories/banks.service";
import { STATUS_API } from '../../../../constants/message';

@Component({
  selector: 'bank-account-add-edit-dialog',
  templateUrl: './bank-account-add-edit-dialog.component.html',
  styleUrl: './bank-account-add-edit-dialog.component.css'
})
export class BankAccountAddEditDialogComponent extends BaseComponent implements OnInit {
  listBank : any[] = [];

  constructor(
    injector: Injector,
    public _service: BankAccountService,
    public banksService: BanksService,
    public dialogRef: MatDialogRef<BankAccountAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public id: any
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      id: [],
      accountName: [null, Validators.required],
      accountNo: [null, Validators.required],
      bankBin: [null, Validators.required],
    });
  }

  async ngOnInit() {
    this.getDataFilter();
    if (this.id) {
      const data = await this.detail(this.id);
      if (data) {
        this.formData.patchValue(data);
      }
    }
  }

  getDataFilter(){
    // Danh sách ngân hàng
    this.banksService.searchList({}).then((res)=>{
      if(res?.status == STATUS_API.SUCCESS){
        this.listBank = res.data;
        this.listBank.forEach(i => {
          i['searchTerm'] = `${i.name} (${i.shortName})`;
        });
      }
    });
  }

  async saveEdit() {
    let body = this.formData.value;
    let data = await this.save(body);
    if (data) {
      this.dialogRef.close(data);
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}

