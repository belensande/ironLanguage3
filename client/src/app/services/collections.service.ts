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
export class CollectionsService {
  BASE_URL: string = `${environment.BASE_URL}/api/collections`;
  constructor(private http: Http) { }

  handleError(e) {
    return Observable.throw(e.json().message);
  }

  getLanguages() {
    return this.http.get(`${this.BASE_URL}/languages`, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getCities() {
    return this.http.get(`${this.BASE_URL}/cities`, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  getGenders() {
    return this.http.get(`${this.BASE_URL}/genders`, options)
      .map(res => res.json())
      .catch(this.handleError);
  }
}
