import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})
export class MenuPage {

  username:string;
  name:string;

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.username = navParams.get('username');
    this.name = navParams.get('name');
    console.log(`Username: ${this.username}\nName: ${this.name}`);
  }
  
}
