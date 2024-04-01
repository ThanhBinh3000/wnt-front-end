import {Injectable} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {ModalComponent} from "../component/modal/modal.component";

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  constructor(
    private dialog: MatDialog
  ) {
  }

  confirm(param: {
    cancelText: string;
    closable: boolean;
    width: number;
    title: string;
    okText: string;
    content: string;
    okDanger: boolean;
    onOk: () => Promise<void>
  }) {
    this.dialog.open(ModalComponent, {
      data: param,
      width: '600px',
    });
  }
}
