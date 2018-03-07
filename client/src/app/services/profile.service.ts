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
export class ProfileService {
  BASE_URL: string = `${environment.BASE_URL}/api/profiles`;
  constructor(private http: Http) { }

  handleError(e) {
    return Observable.throw(e.json().message);
  }

  save(user) {
    return this.http.post(`${this.BASE_URL}/`, user, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  get(id) {
    return this.http.get(`${this.BASE_URL}/${id}`)
      .map((res) => res.json())
      .catch(this.handleError);
  }

  search() {
    return this.http.get(`${this.BASE_URL}/`, options)
      .map(res => res.json())
      .catch(this.handleError);
  }
}
