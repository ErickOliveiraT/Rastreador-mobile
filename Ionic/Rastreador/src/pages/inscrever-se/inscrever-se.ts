import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
import { a } from '@angular/core/src/render3';

@Component({
  selector: 'page-inscrever-se',
  templateUrl: 'inscrever-se.html'
})
export class InscreverSePage {

  username:string;
  name:string;
  password:string;
  email:string;

  constructor(public navCtrl: NavController) {
    

  }
  
  submit() {
    if(this.username=="" || this.name=="" || this.password=="" || this.email=="") {
      alert('Todos os campos precisam ser preechidos');
      return false;
    }

    if(!this.isEmailValid(this.email)) {
      alert('Email inválido')
      return false;
    }

    let data = {
      name: this.name,
      login: this.username,
      email: this.email,
      password: this.password
    }

    //'https://rastreador-mobile.herokuapp.com/adduser'
    axios.post('http://localhost:4000', data)
    .then(function (response) {
      //console.log(response);
      alert('Usuário cadastrado')
    })
    .catch(function (error) { 
      console.log(error)
      if (error.response.data == 'ER_DUP_ENTRY') {
        alert('Esse login está em uso. Por favor, tente um diferente.');
        return false;
      }
      alert('Erro ao cadastrar usuário. Código: ' + error.response.data);
      console.log(error);
    });
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