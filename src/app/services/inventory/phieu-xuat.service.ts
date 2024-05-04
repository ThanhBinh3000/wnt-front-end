import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class PhieuXuatService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-inventory','phieu-xuats');
  }

  lock(body: any) {
    const url = `/api/wnt-inventory/phieu-xuats/lock`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  unlock(body: any) {
    const url = `/api/wnt-inventory/phieu-xuats/unlock`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  getTotalDebtAmountCustomer(body: any) {
    const url = `/api/wnt-inventory/phieu-xuats/get-total-debt-amount-customer`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}
