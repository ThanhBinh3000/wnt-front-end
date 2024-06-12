import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PickUpOrderService extends BaseService {

  private handleOrderSource = new BehaviorSubject<any[]>([]);
  currentHandleOrder = this.handleOrderSource.asObservable();
  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-order','pick-up-order');
  }

  updateHandleOrder(order: any[]) {
    this.handleOrderSource.next(order);
  }

  assignStaff(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/assign-staff`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchPageAssignStaff(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/search-page-assign-staff`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

}
