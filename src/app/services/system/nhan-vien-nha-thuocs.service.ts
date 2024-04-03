import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BaseService} from "../base.service";

@Injectable({
  providedIn: 'root'
})
export class NhanVienNhaThuocsService extends BaseService {

  constructor(httpClient: HttpClient) {
    super(httpClient, 'wnt-system', 'nhan-vien-nha-thuocs');
  }
}
