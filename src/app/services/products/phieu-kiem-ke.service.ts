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

  searchPageThuocChuaKiemKe(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/search-page-not-in-kiem-ke`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
  canKho(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/can-kho`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
  capNhatHanDung(body: any){
    const url = `/api/${this.gateway}/${this.controller}/update-han-dung`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
  xoaChiTiet(body: any){
    const url = `/api/${this.gateway}/${this.controller}/delete-chi-tiet`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}
