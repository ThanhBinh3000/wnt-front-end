import { Component, Inject, Injector, Input, OnInit } from '@angular/core';
import { BaseComponent } from '../../../component/base/base.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MESSAGE, STATUS_API } from '../../../constants/message';
import { ChuongTrinhTraThuongService } from '../../../services/categories/chuong-trinh-tra-thuongservice';
import { SupplierRewardProgramAddEditDialogComponent } from '../supplier-reward-program-add-edit-dialog/supplier-reward-program-add-edit-dialog.component';

@Component({
  selector: 'supplier-reward-program-dialog',
  templateUrl: './supplier-reward-program-dialog.component.html',
  styleUrls: ['./supplier-reward-program-dialog.component.css'],
})
export class SupplierRewardProgramDialogComponent extends BaseComponent implements OnInit {
  displayedColumns = [
    'stt',
    'fromDate',
    'toDate',
    'content',
    'history',
    'action'
  ];
  displayedHeaderColumns = [
    'stt2',
    'time',
    'content2',
    'history2',
    'action2'
  ];
  constructor(
    injector: Injector,
    private _service: ChuongTrinhTraThuongService,
    public dialogRef: MatDialogRef<SupplierRewardProgramDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public object: any,
  ) {
    super(injector, _service);
  }

  async ngOnInit() {
    if (this.object.id) {
      this.getData();     
    }
  }
  async getData(){
    let body: any = {
      supplierId: this.object.id
    };
    this._service.searchList(body).then((res) => {
      this._service.searchList(body).then((res) => {
        if (res?.statusCode == STATUS_API.SUCCESS) {
          this.dataTable = res.data;
        }
      });
    });
  }
  async openAddEditDialog(data: any) {
    data.supplierId = this.object.id;
    const dialogRef = this.dialog.open(SupplierRewardProgramAddEditDialogComponent, {
      data: data,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.getData();
      }
    });
  }
  //delete
  deleteRewardProgram(message: string, item: any) {
    this.modal.confirm({
      closable: false,
      title: 'Xác nhận',
      content: !message ? 'Bạn có chắc chắn muốn xóa?' : message,
      okText: 'Đồng ý',
      cancelText: 'Không',
      okDanger: true,
      width: 310,
      onOk: async () => {
        try {
          let body = {
            id : item.id
          }
          this.service.delete(body).then(async (res) => {
            if(res && res.data){
              this.notification.success(MESSAGE.SUCCESS, MESSAGE.DELETE_SUCCESS);
              await this.getData();
            }
          });
        } catch (e) {
          console.log('error: ', e);
          this.spinner.hide();
          this.notification.error(MESSAGE.ERROR, MESSAGE.SYSTEM_ERROR);
        }
      },
    });
  }
  closeModal() {
    this.dialogRef.close();
  }
}