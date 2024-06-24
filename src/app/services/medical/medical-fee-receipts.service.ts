import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import { ResponseData } from '../../models/response-data';

@Injectable({
  providedIn: 'root'
})
export class MedicalFeeReceiptsService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-medical','medical-fee-receipts');
  }
  getNewNoteNumber() {
    const url = `/api/${this.gateway}/${this.controller}/get-new-note-number`;
    return this.httpClient.get<ResponseData>(url).toPromise();
  }
  getListCustomerDebt(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/get-list-customer-debt`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

}
