import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class PhieuNhapService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-inventory','phieu-nhap');
  }

  lock(body: any) {
    const url = `/api/wnt-inventory/phieu-nhap/lock`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  unlock(body: any) {
    const url = `/api/wnt-inventory/phieu-nhap/unlock`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}
