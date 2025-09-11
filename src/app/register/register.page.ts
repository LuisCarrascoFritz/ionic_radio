import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonInput, IonItem, IonList,IonButton,IonToast } from '@ionic/angular/standalone';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,IonInput, IonItem, IonList,IonButton,IonToast]
})
export class RegisterPage implements OnInit {
  name: string = '';
  email: string = '';
  password: string = '';
  password2: string = '';
  isToastOpen: boolean = false;

  // Campos inválidos
  invalidFields: { [key: string]: boolean } = {};

  constructor() { }

  ngOnInit() {}

  validador() {
    // Resetear estados
    this.invalidFields = {};

    // Validar cada campo
    if (!this.name) this.invalidFields['name'] = true;
    if (!this.email) this.invalidFields['email'] = true;
    if (!this.password) this.invalidFields['password'] = true;
    if (!this.password2) this.invalidFields['password2'] = true;

    if (Object.keys(this.invalidFields).length > 0) {
      this.isToastOpen = true;
    } else {
      alert('¡Registro exitoso!');
    }
  }
}
