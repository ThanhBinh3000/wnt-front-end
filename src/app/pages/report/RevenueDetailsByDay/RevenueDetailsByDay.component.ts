import {AfterViewInit, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {BaseComponent} from "../../../component/base/base.component";
import {MatSort} from "@angular/material/sort";
import {ReportDetailsBydayService} from "../../../services/report/Report-Details-Byday.service";
import {
  DrugGroupAddEditDialogComponent
} from "../../drug-group/drug-group-add-edit-dialog/drug-group-add-edit-dialog.component";

@Component({
  selector: 'RevenueDetailsByDay',
  templateUrl: './RevenueDetailsByDay.component.html',
  styleUrls: ['./RevenueDetailsByDay.component.css'],
})
export class RevenueDetailsByDayComponent extends BaseComponent implements OnInit {
  title: string = "Báo cáo doanh thu chi tiết theo ngày";

  constructor(
    injector: Injector,
    private titleService: Title,
    private _service: ReportDetailsBydayService,
    // private dialog: MatDialog
  ) {
    super(injector, _service);
    this.formData = this.fb.group({
      nhaThuocMaNhaThuoc: [],
      archivedDate: [],
      soPhieuXuat: ['124']
    });
  }

  async ngOnInit() {
    this.titleService.setTitle(this.title);
    await this.searchPage();
  }

  @ViewChild(MatSort) sort?: MatSort;

  async openAddEditDialog(drugGroupID: any) {
    const dialogRef = this.dialog.open(DrugGroupAddEditDialogComponent, {
      data: drugGroupID,
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.searchPage();
      }
    });
  }
}
