import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import { ResponseData } from '../../models/response-data';

@Injectable({
  providedIn: 'root'
})
export class PhieuKiemKeService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-products','phieu-kiem-kes');
  }
  
  checkThuocTonTaiKiemKe(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/check-thuoc-ton-tai-kiem-ke`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  checkBienDong(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/check-bien-dong`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}
