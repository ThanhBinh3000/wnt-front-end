import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";
import {ResponseData} from "../../models/response-data";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UploadFileService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-file','file');
  }


  getUrl(urlFile: string) : Observable<ArrayBuffer>  {
    const url = `/api/${this.gateway}/${this.controller}/${urlFile}`;
    return this.httpClient.get(url, { responseType: 'arraybuffer' });
  }

}
