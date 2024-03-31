import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class NhaThuocsService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-system', 'nha-thuocs');
  }

  searchPageNhaThuoc(body: any) {
    const url = `/api/wnt-system/nha-thuocs/search-page-nha-thuoc`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
  
}
