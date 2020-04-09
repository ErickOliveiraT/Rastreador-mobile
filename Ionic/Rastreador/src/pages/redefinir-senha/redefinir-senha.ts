import { Component } from '@angular/core';
import { NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import axios from 'axios';

import { LoginPage } from '../login/login';

@Component({
  selector: 'page-redefinir-senha',
  templateUrl: 'redefinir-senha.html'
})
export class RedefinirSenhaPage {

  username:string;
  email:string;
  password1:string;
  password2:string;
  rectoken:string;
  API_URL = '/setpassword'

  constructor(public navCtrl: NavController, private navParams: NavParams, private _platform: Platform, public alertController: AlertController) {
    if (this._platform.is("cordova")) {
      this.API_URL = 'https://rastreador-mobile.herokuapp.com/setpassword';
    }
    this.username = navParams.get('username');
    this.email = navParams.get('email');
    console.log(`Username: ${this.username}\nEmail: ${this.email}`);
  }

  submit() {
    if (this.rectoken==""||this.password1==""||this.password2=="") {
      this.presentAlert('Todos os campos devem ser preenchidos')
      return false;
    }
    
    if (this.password1 != this.password2) {
      this.presentAlert('As senhas não correspondem')
      return false;
    }

    const data = {
      login: this.username,
	    password: this.password1,
	    recToken: this.rectoken
    }

    const _this = this;
    
    axios.post(this.API_URL, data)
    .then(function (response) {
      if (response.status != 200) {
        _this.presentAlert(response.data.toString()); 
        return false;
      }
      else {
        _this.presentAlert('Senha alterada com sucesso!');
        _this.navCtrl.push(LoginPage);
      }
    })
    .catch(function (error) { 
      _this.presentAlert('Erro ao verificar o código de recuperação');
    });
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      message: message,
      buttons: ['Ok']
    });

    await alert.present();
  }
}