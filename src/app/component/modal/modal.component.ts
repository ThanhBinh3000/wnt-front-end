import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ModalService} from "../../services/modal.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit {

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
