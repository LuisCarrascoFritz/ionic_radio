import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar,IonInput, IonItem, IonList,IonButton,IonToast } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

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

  invalidFields: { [key: string]: boolean } = {};

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {}

  validador() {
    this.invalidFields = {};
    if (!this.name) this.invalidFields['name'] = true;
    if (!this.email) this.invalidFields['email'] = true;
    if (!this.password) this.invalidFields['password'] = true;
    if (!this.password2) this.invalidFields['password2'] = true;

    if (Object.keys(this.invalidFields).length > 0) {
      this.isToastOpen = true;
    } else {
      this.register();
    }
  }

  async register() {
    const datosUsuario = { email: this.email, password: this.password };
    const exito = await this.authService.register(datosUsuario);
    if (exito === true) {
      alert('Usuario Creado');
      this.router.navigateByUrl('/login');
    } else {
      alert('Error: El email ya está en uso');
    }
  }
}
