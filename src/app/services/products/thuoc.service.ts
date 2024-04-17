import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import { ResponseData } from '../../models/response-data';

@Injectable({
  providedIn: 'root'
})
export class ThuocService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-products','thuoc');
  }

  generateDrugCode(body: any) {
    const url = `/api/wnt-products/thuoc/generate-drug-code`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  generateBarCode(body: any) {
    const url = `/api/wnt-products/thuoc/generate-barcode`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

}
