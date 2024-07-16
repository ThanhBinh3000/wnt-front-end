import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class PhieuDuTruService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-products','phieu-du-tru');
  }

  createNhaCC(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/create-nha-cung-cap`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}
