import { Component } from '@angular/core';
import { NavController, Platform, AlertController } from 'ionic-angular';
import axios from 'axios';

@Component({
  selector: 'page-inscrever-se',
  templateUrl: 'inscrever-se.html'
})
export class InscreverSePage {

  username:string;
  name:string;
  password:string;
  email:string;
  API_URL = '/adduser'

  constructor(public navCtrl: NavController, private _platform: Platform, public alertController: AlertController) {
    if (this._platform.is("cordova")) {
      this.API_URL = 'https://rastreador-mobile.herokuapp.com/adduser';
    }
  }
  
  submit() {
    if(this.username=="" || this.name=="" || this.password=="" || this.email=="") {
      this.presentAlert('Todos os campos precisam ser preenchidos');
      return false;
    }

    if(!this.isEmailValid(this.email)) {
      //alert('Email inválido')
      this.presentAlert('Email inválido');
      return false;
    }

    let data = {
      name: this.name,
      login: this.username,
      email: this.email,
      password: this.password
    }

    const _this = this;
    
    axios.post(this.API_URL, data)
    .then(function (response) {
      _this.presentAlert('Usuário cadastrado com sucesso!');
      _this.navCtrl.pop();
    })
    .catch(function (error) { 
      console.log(error);
      if (error.response.data == 'ER_DUP_ENTRY') {
        _this.presentAlert('Esse login está em uso. Por favor, tente um diferente.');
        return false;
      }
      _this.presentAlert('Erro ao cadastrar usuário. Código: ' + error.response.data);
      console.log(error);
    });
  }

  async presentAlert(message) {
    const alert = await this.alertController.create({
      message: message,
      buttons: ['Ok']
    });

    await alert.present();
  }

  isEmailValid(email) {
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    
    if (!email) return false;
    if(email.length>254) return false;
    
    var valid = emailRegex.test(email);
    if(!valid) return false;

    var parts = email.split("@");
    if(parts[0].length>64) return false;
    
    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; })) return false;
    
    return true;
  }
}