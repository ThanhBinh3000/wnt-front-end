import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseData} from "../models/response-data";
import {RECORD_STATUS} from "../constants/config";

export abstract class BaseService {

  protected constructor(protected httpClient: HttpClient, protected gateway: string, protected controller: string) {
  }

  init(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/init`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchPage(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/search-page`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  searchList(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/search-list`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  create(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/create`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  update(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/update`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  approve(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/approve`
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  cancel(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/cancel`
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  getDetail(id: number) {
    const url = `/api/${this.gateway}/${this.controller}/detail/${id}`;
    return this.httpClient.get<ResponseData>(url).toPromise();
  }

  delete(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/delete`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  restore(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/restore`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  deleteDatabase(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/delete-database`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  deleteMultiple(body: any) {
    body.recordStatusId = RECORD_STATUS.DELETED
    const url = `/api/${this.gateway}/${this.controller}/update/multiple`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  restoreMultiple(body: any) {
    body.recordStatusId = RECORD_STATUS.ACTIVE
    const url = `/api/${this.gateway}/${this.controller}/update/multiple`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  deleteMultipleDatabase(body: any) {
    body.recordStatusId = RECORD_STATUS.DELETED_DATABASE
    const url = `/api/${this.gateway}/${this.controller}/update/multiple`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  lock(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/lock`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  unlock(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/unlock`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  export(body: any): Observable<Blob> {
    const url = `/api/${this.gateway}/${this.controller}/export`;
    return this.httpClient.post(url, body, {responseType: 'blob'});
  }

  preview(id: number) {
    const url = `/api/${this.gateway}/${this.controller}/preview`;
    return this.httpClient.post<ResponseData>(url, id).toPromise();
  }

  downloadFile(fileName: any) {
    const url = `/api/${this.gateway}/${this.controller}/download-file/${fileName}`;
    return this.httpClient.get(url, {responseType: 'blob'}).toPromise();
  }

  import(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/import`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }
}
