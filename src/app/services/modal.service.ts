import {Injectable} from "@angular/core";
import {BehaviorSubject, take} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private confirmSubject = new BehaviorSubject<boolean>(false);
  private confirmDataSubject = new BehaviorSubject<any>({});
  confirm$ = this.confirmSubject.asObservable();
  confirmData$ = this.confirmDataSubject.asObservable();

  constructor() {
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
    this.confirmSubject.next(true);
    this.confirmDataSubject.next(param);
  }

  close(){
    this.confirmSubject.next(false);
    this.confirmDataSubject.next({});
  }

  ok() {
    // Lấy dữ liệu hiện tại từ confirmData$
    this.confirmData$.pipe(take(1)).subscribe(param => {
      // Gọi phương thức onOk nếu được định nghĩa
      if (param && param.onOk) {
        param.onOk().then(() => {
          // Đóng modal sau khi hàm onOk() hoàn thành (nếu cần)
          this.close();
        }).catch((error:any) => {
          console.error('Error in onOk function:', error);
          // Xử lý lỗi nếu cần
        });
      }
    });
  }
}
