import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import { ResponseData } from '../../models/response-data';

@Injectable({
  providedIn: 'root'
})
export class ConnectivityDrugService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-products','connectivity-drug');
  }

  searchPageThuocLienThong(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/search-page-thuoc-lien-thong`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  detailThuocLienThong(drugId: any) {
    const url = `/api/${this.gateway}/${this.controller}/detail-thuoc-lien-thong/${drugId}`;
    return this.httpClient.get<ResponseData>(url).toPromise();
  }
}
