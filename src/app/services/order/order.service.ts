import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class OrdersService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-order','orders');
  }


  sendOrder(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/sendOrder`
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

}
