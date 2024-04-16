import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {BankAccountService} from "../../../../services/categories/bank-account.service";
import {BaseComponent} from "../../../../component/base/base.component";
import {
  BankAccountAddEditDialogComponent
} from "../bank-account-add-edit-dialog/bank-account-add-edit-dialog.component";
import {MatSort} from "@angular/material/sort";
import {NhaThuocsService} from "../../../../services/system/nha-thuocs.service";
import {STATUS_API} from "../../../../constants/message";

@Component({
  selector: 'drug-store-picker-list-dialog',
  templateUrl: './drug-store-picker-list-dialog.component.html',
  styleUrl: './drug-store-picker-list-dialog.component.css'
})
export class DrugStorePickerListDialogComponent extends BaseComponent implements OnInit, AfterViewInit {
  displayedColumns = ['#', 'maNhaThuoc', 'diaChi'];
  selectedRow: any;

  constructor(
    injector: Injector,
    public _service: NhaThuocsService,
    public dialogRef: MatDialogRef<DrugStorePickerListDialogComponent>,
  ) {
    super(injector, _service);
    this.dialogRef.backdropClick().subscribe(() => {
      this.closeModal();
    });
    this.formData = this.fb.group({
      textSearch: ['']
    });
  }

  async ngOnInit() {
    await this.searchPage();
  }

  @ViewChild(MatSort) sort?: MatSort;
  async ngAfterViewInit() {
    this.dataSource.sort = this.sort!;
  }

  closeModal() {
    this.dialogRef.close(this.selectedRow);
  }
}

