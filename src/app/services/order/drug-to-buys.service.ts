import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class DrugToBuysService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-order','drug-to-buys');
  }


  cancelDrugBuy(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/cancel-drug-buy`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  restoreDrugBuy(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/restore-drug-buy`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  completeDrugBuy(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/complete-drug-buy`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

}
