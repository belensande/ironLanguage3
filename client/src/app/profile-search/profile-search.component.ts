import { Component, OnInit } from '@angular/core';
import { SessionService } from "./../services/session.service";
import { ProfileService } from "./../services/profile.service";
import { CollectionsService } from "../services/collections.service";
import { Router } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-profile-search',
  templateUrl: './profile-search.component.html',
  styleUrls: ['./profile-search.component.css']
})
export class ProfileSearchComponent implements OnInit {
  BASE_URL: string = 'http://localhost:3000';

  totalUsers: any[] = [];
  users: any[] = [];

  userInfo: any = {
    username: "",
    name: ""
  };
  city: string = "";
  gender: string = "";
  languagesOffered: string[] = [];
  languagesDemanded: string[] = [];

  showForm: boolean = false;
  error: string;
  languages: string[];
  cities: string[];
  genders: string[];

  constructor(private profileService: ProfileService, private sessionService: SessionService, private collectionsService: CollectionsService, private router: Router) { }

  ngOnInit() {
    this.sessionService.isLogged()
      .subscribe(
      (user) => {
        if (user) {
          this.collectionsService.getLanguages()
            .subscribe(
            (languages) => {
              this.languages = languages;
            });

          this.collectionsService.getCities()
            .subscribe(
            (cities) => {
              this.cities = cities;
            });

          this.collectionsService.getGenders()
            .subscribe(
            (genders) => {
              this.genders = genders;
            });

          this.profileService.search().subscribe(
            (users) => {
              this.totalUsers = users;
              this.users = users;
              if (!users.length) {
                this.error = "No users found";
              }
            },
            (err) => { this.error = err; });
        } else {
          this.router.navigate(['/login']);
        }
      });
  }

  toogleSelectedLanguage(field: string, language: string) {
    this[field] = _.indexOf(this[field], language) == -1 ? _.union(this[field], [language]) : _.without(this[field], language);
    this.filter();
  }

  selectedLanguage(field: string, language: string) { return _.indexOf(this[field], language) != -1; }

  toggleShowForm() {
    this.showForm = !this.showForm;
    this.clearForm();
  }

  clearForm() {
    this.error = "";
    this.users = this.totalUsers;
    this.userInfo = {
      username: "",
      name: ""
    };
    this.city = "";
    this.languagesOffered = [];
    this.languagesDemanded = [];
  }

  filter() {
    this.error = "";
    this.users = this.totalUsers;
    this.users = _.filter(this.users, function (user) {
      const userRegex = new RegExp(this.userInfo.username, 'i');
      const nameRegex = new RegExp(this.userInfo.name, 'i');
      return user.username.match(userRegex) && user.name.match(nameRegex);
    }, this);

    if (this.city && this.users.length) {
      this.users = _.filter(this.users, function (user) {
        return user.city == this.city;
      }, this);
    }

    if (this.gender && this.users.length) {
      this.users = _.filter(this.users, function (user) {
        return user.gender == this.gender;
      }, this);
    }

    if (this.languagesOffered.length && this.users.length) {
      this.users = _.filter(this.users, function (user) {
        return _.difference(this.languagesOffered, user.languagesOffered).length == 0;
      }, this);
    }

    if (this.languagesDemanded.length && this.users.length) {
      this.users = _.filter(this.users, function (user) {
        return _.difference(this.languagesDemanded, user.languagesDemanded).length == 0;
      }, this);
    }

    if (!this.users.length) {
      this.error = "No users found";
    }
  }
}
