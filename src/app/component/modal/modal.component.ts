import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-pagination',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit {

  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;
  @Input() totalRecord: number = 0;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  constructor(
    public modalService: ModalService,
    public dialogRef: MatDialogRef<ModalComponent>,
  ) {

  }


  ngOnInit() {

  }

  confirm() {
    this.modalService.ok();
  }

  closeModal() {
    this.dialogRef.close();
  }

}
