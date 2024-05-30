import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class PickUpOrderDetailService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-order','pick-up-order-detail');
  }


  assignStaff(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/assign-staff`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

}
