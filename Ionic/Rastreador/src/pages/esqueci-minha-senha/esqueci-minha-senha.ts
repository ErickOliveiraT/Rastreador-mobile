import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import axios from 'axios';

import { RedefinirSenhaPage } from '../redefinir-senha/redefinir-senha';

@Component({
  selector: 'page-esqueci-minha-senha',
  templateUrl: 'esqueci-minha-senha.html'
})
export class EsqueciMinhaSenhaPage {

  username:string;

  API_URL = '/getrectoken'

  constructor(public navCtrl: NavController, private _platform: Platform, public alertController: AlertController) {
    if (this._platform.is("cordova")) {
      this.API_URL = 'https://rastreador-mobile.herokuapp.com/getrectoken';
    }
    
  }

  getRecToken() {
    if(this.username == "") {
      this.presentAlert('Por favor, insira seu login');
      return false;
    }

    const _this = this;

    axios.get(this.API_URL + `/${this.username}`)
    .then(function (response) {
      let email = response.data;
      _this.navCtrl.push(RedefinirSenhaPage, {username: _this.username, email: email});
    })
    .catch(function (error) {
      _this.presentAlert('Erro interno. Verifique o login');
    })
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      message: message,
      buttons: ['Ok']
    });

    await alert.present();
  }
}