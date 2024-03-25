import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationSubject = new BehaviorSubject<boolean>(false);
  private notificationContentSubject = new BehaviorSubject<any>({});
  notification$ = this.notificationSubject.asObservable();
  notificationInfo$ = this.notificationContentSubject.asObservable();

  constructor() {
  }

  error(title: string, message: any) {
    this.notificationSubject.next(true);
    this.notificationContentSubject.next({type: 1, title, message});
  }

  success(title: string, message: any) {
    this.notificationSubject.next(true);
    this.notificationContentSubject.next({type: 0, title, message});
  }

  close() {
    this.notificationSubject.next(false);
    this.notificationContentSubject.next({});
  }
}
