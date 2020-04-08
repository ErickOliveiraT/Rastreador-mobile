import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { InscreverSePage } from '../pages/inscrever-se/inscrever-se';
import { EsqueciMinhaSenhaPage } from '../pages/esqueci-minha-senha/esqueci-minha-senha';
import { RedefinirSenhaPage } from '../pages/redefinir-senha/redefinir-senha';
import { MenuPage } from '../pages/menu/menu';


import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    InscreverSePage,
    EsqueciMinhaSenhaPage,
    RedefinirSenhaPage,
    MenuPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    InscreverSePage,
    EsqueciMinhaSenhaPage,
    RedefinirSenhaPage,
    MenuPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}