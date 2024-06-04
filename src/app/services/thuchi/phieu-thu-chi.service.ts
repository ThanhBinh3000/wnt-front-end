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

  getSoPhieuThuChi(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/get-so-phieu-thu-chi`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  getInComingCustomerDebt(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/get-in-coming-customer-debt`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  getOutReturnCustomerDebt(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/get-out-return-customer-debt`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  getOutComingSupplierDebt(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/get-out-coming-supplier-debt`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  getInReturnSupplierDebt(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/get-in-return-supplier-debt`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}
