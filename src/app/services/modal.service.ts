import {Injectable} from "@angular/core";
import {StorageService} from "./storage.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private httpClient: HttpClient,
              private storageService: StorageService) {
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
    
  }
}
