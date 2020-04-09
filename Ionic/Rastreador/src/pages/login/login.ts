import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import jsonwebtoken from 'jsonwebtoken'
import axios from 'axios';
import secret from './credentials'

import { InscreverSePage } from '../inscrever-se/inscrever-se';
import { EsqueciMinhaSenhaPage } from '../esqueci-minha-senha/esqueci-minha-senha';
import { MenuPage } from '../menu/menu';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})

export class LoginPage {

  username:string;
  password:string;
  API_URL = '/autenticate'

  constructor(public navCtrl: NavController, private _platform: Platform, public alertController: AlertController) {
    if (this._platform.is("cordova")) {
      this.API_URL = 'https://rastreador-mobile.herokuapp.com/autenticate';
    }
    const owner = this.checkToken();
    if (owner) {
      const name = localStorage.getItem("tracker_name");
      if (name) this.navCtrl.push(MenuPage, {name: name, username: owner});
    }
  }

  autenticate() {
    if(this.username=="" || this.password=="") {
      this.presentAlert('Todos os campos precisam ser preenchidos');
      return false;
    }

    let data = {
      login: this.username,
      password: this.password
    }

    const _this = this;
    
    axios.post(this.API_URL, data)
    .then(function (response) {
      if (response.data.valid == true) {
        const name = response.data.name;
        const token = response.data.token;
        localStorage.setItem("tracker_token", token);
        localStorage.setItem("tracker_name", name);
        _this.navCtrl.push(MenuPage, {name: name, username: data.login});
      }
      else {
        _this.presentAlert('Usuário e/ou senha incorreto(s)');
        return false;
      }
    })
    .catch(function (error) { 
      _this.presentAlert('Erro interno: ' + error);
    });
  }

  checkToken() {
    const token = localStorage.getItem("tracker_token");
    if (!token) return false;

    let owner = null;
    jsonwebtoken.verify(token, secret.secret, (err, dec) => {
        if (err) return;
        owner = dec.login;
    });
    return owner;
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      message: message,
      buttons: ['Ok']
    });

    await alert.present();
  }

  gotoSign() {
    this.navCtrl.push(InscreverSePage);
  }

  gotoForgot() {
    this.navCtrl.push(EsqueciMinhaSenhaPage);
  }
  
}