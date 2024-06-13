import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class PhieuDichVuService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-medical','phieu-dich-vu');
  }

  searchPageLieuTrinh(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/search-page-lieu-trinh`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchPageChoThucHien(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/search-page-cho-thuc-hien`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  generateBarCode(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/bar-code`;
    return this.httpClient.get<ResponseData>(url, body).toPromise();
  }

  getServicePackagesByCustomer(body: any){
    const url = `/api/${this.gateway}/${this.controller}/search-list-by-customer`;
    return this.httpClient.get<ResponseData>(url, body).toPromise();
  }
}
