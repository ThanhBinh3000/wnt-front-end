import {Injectable} from '@angular/core';
import {Socket, SocketIoConfig} from 'ngx-socket-io';
import {environment} from "../../../environments/environment";

const socketConfig: SocketIoConfig = {url: environment.socketConfig.url, options: environment.socketConfig.options};

@Injectable({
  providedIn: 'root'
})
export class SocketService extends Socket {

  constructor() {
    super(socketConfig)
  }
}
