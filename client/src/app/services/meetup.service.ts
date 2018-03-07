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
export class MeetupService {
  BASE_URL: string = 'http://localhost:3000/api/meetups';
  constructor(private http: Http) { }

  handleError(e) {
    return Observable.throw(e.json().message);
  }

  create(meetup) {
    return this.http.post(`${this.BASE_URL}`, meetup, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  get(city) {
    return this.http.get(`${this.BASE_URL}${city ? '/city' : ''}`, options)
      .map((res) => res.json())
      .catch(this.handleError);
  }

  getDetail(id) {
    return this.http.get(`${this.BASE_URL}/detail/${id}`, options)
      .map((res) => res.json())
      .catch(this.handleError);
  }

  assist(meetupId, userId) {
    return this.http.post(`${this.BASE_URL}/assist`, {meetup: meetupId, user: userId} ,options)
      .map((res) => res.json())
      .catch(this.handleError);
  }

  getAssist(userId) {
    return this.http.get(`${this.BASE_URL}/${userId}/assist`, options)
      .map((res) => res.json())
      .catch(this.handleError);
  }

  getOwned(userId) {
    return this.http.get(`${this.BASE_URL}/${userId}/own`, options)
      .map((res) => res.json())
      .catch(this.handleError);
  }

  getMessages(id) {
    return this.http.get(`${this.BASE_URL}/messages/${id}`, options)
      .map((res) => res.json())
      .catch(this.handleError);
  }

  sendMessage(message) {
    return this.http.post(`${this.BASE_URL}/messages/${message.meetup}`, { message }, options)
      .map((res) => res.json())
      .catch(this.handleError);
  }
}
