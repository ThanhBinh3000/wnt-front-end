import {Component, Inject, Injector, OnInit} from '@angular/core';
import { Title } from '@angular/platform-browser';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {BaseComponent} from "../../../component/base/base.component";
import {PhieuThuChiService} from "../../../services/thuchi/phieu-thu-chi.service";

@Component({
  selector: 'other-in-out-note-add-edit-dialog',
  templateUrl: './other-in-out-note-add-edit-dialog.component.html',
  styleUrls: ['./other-in-out-note-add-edit-dialog.component.css'],
})
export class OtherInOutNoteAddEditDialogComponent extends BaseComponent implements OnInit {
  inComingNoteID: number = 0;
  showMoreForm: boolean = false;
  expandLabel: string = '[+]';

  constructor(
    injector: Injector,
    private _service: PhieuThuChiService,
    public dialogRef: MatDialogRef<OtherInOutNoteAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    super(injector, _service);
  }


  ngOnInit() {
  }

  expandForm() {
    this.showMoreForm = !this.showMoreForm;
    this.expandLabel = this.showMoreForm ? '[-]' : '[+]';
  };
}
