import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class PhieuXuatService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-inventory','phieu-xuats');
  }

  sync(body: any) {
    const url = `/api/wnt-inventory/phieu-xuats/sync`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  resetSync(body: any) {
    const url = `/api/wnt-inventory/phieu-xuats/reset-sync`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  getTotalDebtAmountCustomer(body: any) {
    const url = `/api/wnt-inventory/phieu-xuats/get-total-debt-amount-customer`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  convertSampleNoteToDeliveryNote(sampleNoteId: number) {
    const url = `/api/wnt-inventory/phieu-xuats/convert-sample-note-to-delivery-note/${sampleNoteId}`;
    return this.httpClient.get<ResponseData>(url).toPromise();
  }
}
