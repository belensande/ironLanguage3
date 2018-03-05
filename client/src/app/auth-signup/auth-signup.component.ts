import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';
import { CollectionsService } from "../services/collections.service";
import { ProfileService } from "../services/profile.service";
import { Router } from '@angular/router';
import { FileUploader } from 'ng2-file-upload';
import * as _ from 'underscore';

@Component({
  selector: 'app-auth-signup',
  templateUrl: './auth-signup.component.html',
  styleUrls: ['./auth-signup.component.css']
})
export class AuthSignupComponent implements OnInit {
  BASE_URL: string = 'http://localhost:3000';
  uploader: FileUploader;

  isEdit: boolean = false;

  formInfo: any = {
    username: "",
    password: "",
    email: "",
    name: "",
    description: "",
    interests: ""
  };
  city: string;
  gender: string;
  languagesOffered: string[] = [];
  languagesDemanded: string[] = [];

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
          if (this.router.url === "/edit") {
            this.uploader = new FileUploader({
              url: `${this.BASE_URL}/api/profiles`
            });
            this.uploader.onSuccessItem = (item, response) => {
              this.router.navigate(['/private']);
            };

            this.uploader.onErrorItem = (item, response, status, headers) => {
              item.isUploaded = false;
              this.error = JSON.parse(response).message;
            };
            this.isEdit = true;
            this.formInfo = {
              username: user.username,
              password: user.password,
              email: user.email,
              name: user.name,
              description: user.description,
              interests: user.interests
            };
            this.city = user.city;
            if (user.gender) {
              this.gender= user.gender;
            }            
            this.languagesOffered = user.languagesOffered;
            this.languagesDemanded = user.languagesDemanded;
            this["avatar"] = user.imageUrl;
          } else {
            this.uploader = new FileUploader({
              url: `${this.BASE_URL}/api/signup/`
            });

            this.uploader.onBuildItemForm = (item, form) => {
              form.append('username', this.formInfo.username);
              form.append('password', this.formInfo.password);
              form.append('email', this.formInfo.email);
              form.append('name', this.formInfo.name);
              form.append('description', this.formInfo.description);
              form.append('interests', this.formInfo.interests);
              if (this.formInfo.city) {
                form.append('city', this.formInfo.city);
              }
              if (this.formInfo.gender) {
                form.append('gender', this.formInfo.gender);
              }
              if (this.formInfo.languagesOffered) {
                form.append('languagesOffered', this.formInfo.languagesOffered);
              }
              if (this.formInfo.languagesOffered) {
                form.append('languagesDemanded', this.formInfo.languagesDemanded);
              }
            };

            this.uploader.onSuccessItem = (item, response) => {
              if (this.isEdit) {
                this.router.navigate(['/profile']);
              } else {
                this.router.navigate(['/private']);
              }
            };

            this.uploader.onErrorItem = (item, response, status, headers) => {
              item.isUploaded = false;
              this.error = JSON.parse(response).message;
            };
          }
        }
      });

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
  }

  toogleSelectedLanguage(field: string, language: string) {
    this[field] = _.indexOf(this[field], language) == -1 ? _.union(this[field], [language]) : _.without(this[field], language);
  }

  selectedLanguage(field: string, language: string) { return _.indexOf(this[field], language) != -1; }

  submit() {
    
    if(!this.formInfo.username || !this.formInfo.password || !this.formInfo.email || !this.formInfo.name) {
      this.error="You must provide username, password, email and name"
    }

    delete this.formInfo['languagesOffered'];
    delete this.formInfo['languagesDemanded'];
    delete this.formInfo['city'];
    delete this.formInfo['gender'];

    if (this.city) {
      this.formInfo['city'] = this.city;
    }
    if (this.gender) {
      this.formInfo['gender'] = this.gender;
    }
    if (this.languagesOffered.length) {
      this.formInfo['languagesOffered'] = JSON.stringify(this.languagesOffered);
    }
    if (this.languagesDemanded.length) {
      this.formInfo['languagesDemanded'] = JSON.stringify(this.languagesDemanded);
    }

    if (this.uploader.queue.length) {
      this.uploader.uploadAll();
    } else {
      if (this.isEdit) {
        this.profileService.save(this.formInfo)
          .subscribe(
          (user) => { this.router.navigate(['/profile']); },
          (err) => { this.error = err; });
      } else {
        this.sessionService.signup(this.formInfo)
          .subscribe(
          (user) => { this.router.navigate(['/private']); },
          (err) => { this.error = err; });
      }
    }
  }
}
