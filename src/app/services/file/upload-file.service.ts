import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";

@Injectable({
  providedIn: 'root'
})
export class UploadFileService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-file','file');
  }

  upload(body: any) {
    const url = `/api/${this.gateway}/${this.controller}/upload`;
    return this.httpClient.post<ResponseData>(url, body).toPromise();
  }

}
