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
}
