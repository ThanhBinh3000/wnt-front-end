import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import { ResponseData } from '../../models/response-data';

@Injectable({
  providedIn: 'root'
})
export class NhaCungCapService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-categories','nha-cung-cap');
  }
  searchFilterPageNhaCungCap(body : any){
    const url = `/api/wnt-categories/nha-cung-cap/search-page`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}
