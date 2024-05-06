import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import { ResponseData } from '../../models/response-data';

@Injectable({
  providedIn: 'root'
})
export class PhieuThuChiService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-thuchi','phieu-thu-chis');
  }
  searchListPhieuNhap(body: any) {
    const url = `/api/wnt-thuchi/phieu-nhap/search-list`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
  searchListPhieuXuat(body: any) {
    const url = `/api/wnt-thuchi/phieu-xuat/search-list`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
  getMaxNoteNumber(body: any) {
    const url = `/api/wnt-thuchi/phieu-thu-chis/tao-so-phieu`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}
