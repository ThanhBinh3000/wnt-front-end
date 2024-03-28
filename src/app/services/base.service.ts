import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ResponseData} from "../models/response-data";

export abstract class BaseService {

  protected constructor(protected httpClient: HttpClient, private gateway: string, private controller: string) {
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

  getDetail(id: number) {
    const url = `/api/${this.gateway}/${this.controller}/detail/${id}`;
    return this.httpClient.get<ResponseData>(url).toPromise();
  }

  delete(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/delete`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

  deleteMultiple(ids: number[]) {
    const url = `/api/${this.gateway}/${this.controller}/delete/multiple`;
    return this.httpClient.post<ResponseData>(url, ids).toPromise();
  }

  export(id: number): Observable<Blob> {
    const url = `/api/${this.gateway}/${this.controller}/export`;
    return this.httpClient.post(url, id, {responseType: 'blob'});
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
