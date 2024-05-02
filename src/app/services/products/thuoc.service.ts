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

  uploadImage(file: File, body?: any){
    const url: string = `/api/${this.gateway}/${this.controller}/upload-image`;
    const formData = new FormData();
    const folder = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + this.getCurrentWeek();
    formData.append('file', file);
    formData.append('title', body?.dataId+'-'+body.dataType);
    formData.append('folder', 'wnt/' + folder);
    formData.append('dataId', body?.dataId);
    formData.append('dataType', body?.dataType);
    return this.httpClient.post<any>(url, formData).toPromise();
  }

  getCurrentWeek(): number {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const daysSinceFirstDay = (currentDate.getDate() - 1);
    const weekOfMonth = Math.ceil((daysSinceFirstDay + firstDayOfMonth.getDay() + 1) / 7);
    return weekOfMonth;
  }

}
