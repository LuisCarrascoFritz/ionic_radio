  import { Component, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { IonContent, IonHeader, IonTitle, IonToolbar,IonInput, IonItem, IonList,IonButton,IonToast } from '@ionic/angular/standalone';

  @Component({
    selector: 'app-recover-pasword',
    templateUrl: './recover-pasword.page.html',
    styleUrls: ['./recover-pasword.page.scss'],
    standalone: true,
    imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonInput, IonItem, IonList,IonButton, IonToast]
  })
  export class RecoverPaswordPage implements OnInit {
    email: string = '';
    invalidFields: { [key: string]: boolean } = {};
    constructor() { }

    ngOnInit() {
    }
    isToastOpen = false;
    toastMessage: string = ''; 
    recover() {
      this.invalidFields = {};
    
      if (!this.email) {
        this.invalidFields['email'] = true;
        this.toastMessage = 'Por favor ingrese un email'; // ✅ mensaje de error
        this.isToastOpen = true;
      } else {
        this.toastMessage = '¡Correo enviado correctamente!'; // mensaje de éxito
        this.isToastOpen = true;
        console.log('Email enviado a:', this.email);
      }
    }
    
  }  
