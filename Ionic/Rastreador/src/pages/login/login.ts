import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { InscreverSePage } from '../inscrever-se/inscrever-se';
import { EsqueciMinhaSenhaPage } from '../esqueci-minha-senha/esqueci-minha-senha';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  constructor(public navCtrl: NavController) {

    //this.navCtrl.push(InscreverSePage);

    
    
  }

  gotoSign() {
    this.navCtrl.push(InscreverSePage);
  }

  gotoForgot() {
    this.navCtrl.push(EsqueciMinhaSenhaPage);
  }
  
}
