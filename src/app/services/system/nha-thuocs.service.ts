import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";

@Injectable({
  providedIn: 'root'
})
export class NhaThuocsService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-system','nha-thuocs');
  }


}
