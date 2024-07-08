import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class NhaThuocsService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-system', 'nha-thuocs');
  }

  searchPageNhaThuoc(body: any) {
    const url = `/api/wnt-system/nha-thuocs/search-page-nha-thuoc`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  getDetailByCode(code: string) {
    const url = `/api/wnt-system/nha-thuocs/detail-by-code/${code}`;
    return this.httpClient.get<ResponseData>(url).toPromise();
  }

  getNewStoreCode() {
    const url = `/api/wnt-system/nha-thuocs/new-store-code`;
    return this.httpClient.get<ResponseData>(url).toPromise();
  }

  searchPageNhaThuocDongBoPhieu(body: any) {
    const url = `/api/wnt-system/nha-thuocs/search-page-nha-thuoc-dong-bo-phieu`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchPageNhaThuocTong(body: any) {
    const url = `/api/wnt-system/nha-thuocs/search-page-nha-thuoc-tong`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchPageNhaThuocTrienKhai(body: any) {
    const url = `/api/wnt-system/nha-thuocs/search-page-nha-thuoc-trien-khai`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchListByNv(body: any) {
    const url = `/api/wnt-system/nha-thuocs/search-list-by-nv`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}
