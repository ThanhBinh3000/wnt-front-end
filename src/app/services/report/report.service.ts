import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-report', 'report');
  }

  getInOutcommingDetailsByDayData(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/getInOutcommingDetailsByDayData`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  getRevenueDrugSynthesis(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/getRevenueDrugSynthesis`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  getInventoryWarehouseData(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/getInventoryWarehouseData`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

}
