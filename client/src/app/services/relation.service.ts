import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';

let headers = new Headers({ 'Content-Type': 'application/json' });
let options = new RequestOptions({ headers: headers, withCredentials: true });

@Injectable()
export class RelationService {
  BASE_URL: string = 'http://localhost:3000/api/relations';
  constructor(private http: Http) { }

  handleError(e) {
    return Observable.throw(e.json().message);
  }

  accept(id) {
    return this.http.post(`${this.BASE_URL}/accept`, { 'id': id }, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  askContact(id) {
    return this.http.post(`${this.BASE_URL}/ask`, { 'id': id }, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getRelations() {
    return this.http.get(`${this.BASE_URL}/`, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getMessages() {
    return this.http.get(`${this.BASE_URL}/messages`, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  chekMessages(id) {
    return this.http.post(`${this.BASE_URL}/messages/check`, { 'contact': id }, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  newMessage(id, text) {
    return this.http.post(`${this.BASE_URL}/messages/${id}`, { 'text': text }, options)
      .map(res => res.json())
      .catch(this.handleError);
  }
}
