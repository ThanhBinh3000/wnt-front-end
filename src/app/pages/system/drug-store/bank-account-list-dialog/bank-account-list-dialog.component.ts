import {AfterViewInit, Component, Inject, Injector, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BankAccountService} from "../../../../services/categories/bank-account.service";
import {BaseComponent} from "../../../../component/base/base.component";
import {
  CustomerGroupAddEditDialogComponent
} from "../../../customer-group/customer-group-add-edit-dialog/customer-group-add-edit-dialog.component";
import {
  BankAccountAddEditDialogComponent
} from "../bank-account-add-edit-dialog/bank-account-add-edit-dialog.component";
import {MatSort} from "@angular/material/sort";
import {AuthService} from "../../../../services/auth.service";
import {STORAGE_KEY} from "../../../../constants/config";

@Component({
  selector: 'bank-account-list-dialog',
  templateUrl: './bank-account-list-dialog.component.html',
  styleUrl: './bank-account-list-dialog.component.css'
})
export class BankAccountListDialogComponent extends BaseComponent implements OnInit, AfterViewInit {
  displayedColumns = ['#', 'accountNo', 'bankBin', 'action'];

  constructor(
    injector: Injector,
    public _service: BankAccountService,
    public authService: AuthService,
    public dialogRef: MatDialogRef<BankAccountListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public storeCode: any
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      storeCode: [null]
    });
  }

  async ngOnInit() {
    if(this.storeCode) {
      this.formData.patchValue({
        storeCode: this.storeCode
      })
    }
    await this.searchPage();
  }

  @ViewChild(MatSort) sort?: MatSort;
  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  async openAddEditDialog(id: any) {
    const dialogRef = this.dialog.open(BankAccountAddEditDialogComponent, {
      data: id,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}

