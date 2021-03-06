import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {forEach} from '@angular-devkit/schematics';
const optionRequete = {
  headers : new HttpHeaders({'Access-Control-Allow-Origin': '*'})
};

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  readonly root = 'http://localhost/immo-api/public';
  showingMessage = false;
  messageInput = '';
  messages: any;
  detailMessage: any;
  toast: any;
  idAnnonce: any;
  // connexion
  connected: string;
  userJson: any;
  usrInput: any;
  pwdInput: any;
  data: any;
  userId: any;


  constructor(private toastCtrl: ToastController, private http: HttpClient) {
    if (this.checkIfLogged()) {
      this.getMessages();
    }
  }
  async settingToast() {
    this.toast = this.toastCtrl.create({
      message: 'Bad input',
      duration: 3000,
      position: 'bottom'
    });
    return await this.toast.present();
  }
  getMessages() {
    this.http.get(this.root + '/message/getMessage/' + sessionStorage.getItem('loggedId'), optionRequete).subscribe(data => {
      this.messages = data;
    });
  }
  showMessage(idAnnonce) {
    if (this.showingMessage === false) {
      this.showingMessage = true;
      this.http.get(this.root + '/message/getDetailMessage/' + sessionStorage.getItem('loggedId'), optionRequete).subscribe(data => {
        this.detailMessage = data;
        console.log(data);
        this.idAnnonce = idAnnonce;
        console.log(this.idAnnonce);
      });
    } else {
      this.showingMessage = false;
    }
  }

  checkIfLogged() {
    return sessionStorage.getItem('loggedId') != null;
  }
  sendMessage() {
    if (this.messageInput !== '') {
      const params = '{"id_annonce": "' + this.idAnnonce
                    + '", "id_sender": "' + sessionStorage.getItem('loggedId')
                    + '", "message": "' + this.messageInput + '"}';
      this.http.post(this.root + '/message/addMessage', params, optionRequete).subscribe(data => {
        if (data === 1) {
          console.log('ajout message');
          this.showMessage(this.idAnnonce);
          this.messageInput = '';
        }
      });
    } else {
      // this.toast.present();
    }
  }
  verifTitle() {
    if (this.showingMessage === true) {
      return true;
    } else {
      return false;
    }
  }
  logUser() {
    console.log('Log button clicked');
    this.data = '{"username": "' + this.usrInput + '", "password": "' + this.pwdInput + '"}';
    this.http.post(this.root + '/compte/login', this.data, optionRequete).subscribe(data => {
      if (data === 1) {
        sessionStorage.setItem('loggedUser', this.usrInput);
        this.http.get(this.root + '/compte/getCompteByUsername/' + this.usrInput, optionRequete).subscribe(result => {
          this.userJson = result;
          this.userId = this.userJson[0].id;
          sessionStorage.setItem('loggedId', this.userId);
          this.getMessages();
        });
        this.connected = sessionStorage.getItem('loggedUser');
      } else {
        console.log('connexion échouée');
      }
    });
  }
}
