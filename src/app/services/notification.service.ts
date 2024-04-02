import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {ToastrService} from "ngx-toastr";

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  constructor(
    private _toastr: ToastrService
  ) {
  }

  error(title: string, message: any) {
    this._toastr.error(message, title, {
      timeOut: 6000,
      closeButton: true
    });
  }

  success(title: string, message: any) {
    this._toastr.success(message, title, {
      timeOut: 3000,
      closeButton: true
    });
  }

  info(title: string, message: any) {
    this._toastr.info(message, title, {
      timeOut: 60000,
      closeButton: true
    });
  }
}
