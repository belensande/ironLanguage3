import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { SessionService } from "./../services/session.service";
import { MeetupService } from "./../services/meetup.service";
import { CollectionsService } from "./../services/collections.service";
import { Router } from '@angular/router';
import * as _ from 'underscore';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps'

@Component({
  selector: 'app-meetup',
  templateUrl: './meetup.component.html',
  styleUrls: ['./meetup.component.css']
})
export class MeetupComponent implements OnInit {

  @ViewChild('search') public searchElement: ElementRef;

  meetupInfo: any = {};
  error: String;
  description: "";
  place: String = "";
  address: String;
  location: any;
  date: Date;
  city: String = "";
  languages: String[] = [];
  now: Date = new Date();

  cities: String[];
  availableLanguages: String[];

  constructor(private mapsAPILoader: MapsAPILoader, private meetupService: MeetupService, private session: SessionService, private collectionsService: CollectionsService, private router: Router) { }

  ngOnInit() {
    this.session.isLogged()
      .subscribe(
      (user) => {
        if (!user) {
          this.router.navigate(['/login']);
        } else {

          this.collectionsService.getLanguages()
            .subscribe(
            (languages) => {
              this.availableLanguages = languages;
            });

          this.collectionsService.getCities()
            .subscribe(
            (cities) => {
              this.cities = cities;
            });

          this.mapsAPILoader.load().then(
            () => {
              let autocomplete = new google.maps.places.Autocomplete(this.searchElement.nativeElement, { types: ["address"] });

              autocomplete.addListener("place_changed", () => {
                this.error = "";
                let place: google.maps.places.PlaceResult = autocomplete.getPlace();

                if (!place.geometry) {
                  this.location = {};
                } else {
                  this.location = place.geometry.location;
                  this.address = place.formatted_address;
                }
              });
            });
        }
      });
  }

  toogleSelectedLanguage(language: string) {
    this.languages = _.indexOf(this.languages, language) == -1 ? _.union(this.languages, [language]) : _.without(this.languages, language);
  }

  create() {
    this.error = "";
    if (!this.description || !this.address || ! this.date) {
      this.error = "Description, address and date are mandatory";
    } else {
      this.meetupInfo = {};
      this.meetupInfo['description'] = this.description;
      this.meetupInfo['address'] = this.address;
      this.meetupInfo['date'] = this.date;

      if (this.location) {
        this.meetupInfo['location'] = this.location;
      }
      if (this.place) {
        this.meetupInfo['place'] = this.place;
      }
      if (this.city) {
        this.meetupInfo['city'] = this.city;
      }
      if (this.languages.length) {
        this.meetupInfo['languages'] = JSON.stringify(this.languages);
      }

      this.meetupService.create(this.meetupInfo)
        .subscribe(
        (meetup) => { this.router.navigate(['/meetup/list']); },
        (err) => { this.error = err; });
    }

  }

}
