import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ThuocService } from '../../../services/products/thuoc.service';

@Component({
  selector: 'drug-update-inprice-dialog',
  templateUrl: './drug-update-inprice-dialog.component.html',
  styleUrls: ['./drug-update-inprice-dialog.component.css'],
})
export class DrugUpdateInpriceDialogComponent extends BaseComponent implements OnInit {

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: ThuocService,
    public dialogRef: MatDialogRef<DrugUpdateInpriceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(injector, _service);
  }

  ngOnInit() {
  }

}