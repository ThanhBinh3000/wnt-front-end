import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import { ResponseData } from '../../models/response-data';

@Injectable({
  providedIn: 'root'
})
export class KhachHangService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-customer','khach-hangs');
  }
  searchListNguoiQuanTamOA() {
    const url = `/api/wnt-customer/khach-hangs/nguoi-quan-tam-oa`;
    return this.httpClient.get<ResponseData>(url).toPromise();
  }

}
