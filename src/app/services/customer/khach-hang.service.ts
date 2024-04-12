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
  searchPageNguoiQuanTamOA(body: any) {
    const url = `/api/wnt-customer/khach-hangs/search-page-nguoi-quan-tam-oa`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
  updateMappingZaloOA(body: any){
    const url = `/api/wnt-customer/khach-hangs/update-mapping-zalo-oa`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
  updateMappingMappingStore(body: any){
    const url = `/api/wnt-customer/khach-hangs/update-mapping-store`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}
