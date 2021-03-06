import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { environment } from '../../environments/environment';

let headers = new Headers({ 'Content-Type': 'application/json' });
let options = new RequestOptions({ headers: headers, withCredentials: true });

@Injectable()
export class MessageService {
  BASE_URL: string = `${environment.BASE_URL}/api/messages`;
  constructor(private http: Http) { }

  handleError(e) {
    return Observable.throw(e.json().message);
  }

  getMessages(id) {
    return this.http.get(`${this.BASE_URL}/${id}`, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  chekMessages(id) {
    return this.http.post(`${this.BASE_URL}/check`, { 'contact': id }, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  newMessage(id, text) {
    return this.http.post(`${this.BASE_URL}/${id}`, { 'text': text }, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getNews() {
    return this.http.get(`${this.BASE_URL}/news`, options)
      .map(res => res.json())
      .catch(this.handleError);
  }
}
