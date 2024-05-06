import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class PhieuKhamService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-medical','phieu-kham');
  }

  searchPagePhieuKham(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/search-page-phieu-kham`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}
