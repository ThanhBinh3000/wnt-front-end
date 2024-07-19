import { DatePipe } from '@angular/common';
import { Component, Inject, Injector, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { BaseComponent } from '../../../component/base/base.component';
import { EsDiagnoseService } from '../../../services/categories/esdiagnose.service';
import { KhachHangService } from '../../../services/customer/khach-hang.service';
import { BacSiesService } from '../../../services/medical/bac-sies.service';
import { SampleNoteService } from '../../../services/products/sample-note.service';
import { ThuocService } from '../../../services/products/thuoc.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MESSAGE, STATUS_API } from '../../../constants/message';
import { SETTING } from '../../../constants/setting';


@Component({
  selector: 'sample-note-history-dialog',
  templateUrl: './sample-note-history-dialog.component.html',
  styleUrls: ['./sample-note-history-dialog.component.css'],
})
export class SampleNoteHistoryDialogComponent extends BaseComponent implements OnInit {
  listData: any = [];
  displayedColumns = ['stt', 'id', 'noteDate', 'doctor', 'noteName', 'description', 'tenThuoc', 'donVi', 'soLuong', 'ghiChuThuoc', 'action'];
  override pageSize: number = 3;
  pageSizeOptions: { label: string, value: number }[] = [
    { label: '3', value: 3 },
    { label: '10', value: 10 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
    { label: '--All--', value: 1000 }
  ];

  // Settings
  useSampleNoteFromParent = this.authService.getSettingByKey(SETTING.USE_SAMPLE_NOTE_FROM_PARENT);

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: SampleNoteService,
    public dialogRef: MatDialogRef<SampleNoteHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      maNhaThuoc: [this.useSampleNoteFromParent.activated ? this.getMaNhaThuocCha() : this.getMaNhaThuoc()],
      patientId: [],
      noteName: [],
    });
  }

  async ngOnInit() {
    await this.searchPage();
  }

  override async searchPage() {
    this.formData.patchValue({ patientId: this.data.id });
    try {
      let body = this.formData.value
      body.paggingReq = {
        limit: this.pageSize,
        page: this.page - 1
      }
      let res = await this._service.getTranSampleNotes(body);
      if (res?.status == STATUS_API.SUCCESS) {
        let data = res.data;
        this.listData = data.content;
        this.dataTable = [];
        this.totalRecord = data.totalElements;
        this.totalPages = data.totalPages;
      } else {
        this.dataTable = [];
        this.totalRecord = 0;
      }
    } catch (e) {
      this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
    }
    //console.log(this.listData);
    var order = 0;
    this.listData.forEach((i: any) => {
      order++;
      var index = 0;
      if(i.chiTiets != null && i.chiTiets.length > 0){
        i.chiTiets.forEach((ii: any) => {
          var item = {
            order: index == 0 ? order : '',
            id: index == 0 ? i.id : '',
            noteDate: index == 0 ? i.noteDate : '',
            doctorName: index == 0 ? i.doctorName : '',
            noteName: index == 0 ? i.noteName : '',
            description: index == 0 ? i.description : '',
            drugNameText: ii.drugNameText,
            drugUnitText: ii.drugUnitText,
            quantity: ii.quantity,
            comment: ii.comment,
          };
          this.dataTable.push(item);
          index++;
        });
      }
    });
    //console.log(this.dataTable);
  }

  getMaNhaThuoc() {
    return this.authService.getNhaThuoc().maNhaThuoc;
  }

  getMaNhaThuocCha() {
    return this.authService.getNhaThuoc().maNhaThuocCha;
  }

  closeModal() {
    this.dialogRef.close();
  }

}
