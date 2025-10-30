import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonToast, IonItem, IonButton, IonInputPasswordToggle, IonInput } from '@ionic/angular/standalone';
import { Router, RouterModule } from '@angular/router';


import { AuthService } from '../services/auth'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonItem, IonButton, IonInput, IonInputPasswordToggle, IonToast, RouterModule]
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';
  isToastOpen: boolean = false;
  shakeInputs: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService 
  ) { }

  ngOnInit() {
  }

  async login() {
    const emailTest = 'test@test.com';
    const passTest = '123';
    if (this.email === emailTest && this.password === passTest) {
      await this.authService.loginSuccess('test-fake-token-sqlite');
      this.router.navigateByUrl('/main');
      return;
    }
    const datosUsuario = { email: this.email, password: this.password };
    try {
      const usuarioEncontrado = await this.authService.login(datosUsuario);
      if (usuarioEncontrado === true) {
        await this.authService.loginSuccess(datosUsuario.email);
        this.router.navigateByUrl('/main');
      } else {
        this.isToastOpen = true;
        this.shakeInputs = true;
        setTimeout(() => this.shakeInputs = false, 300);
      }
    } catch (_) {
      this.isToastOpen = true;
      this.shakeInputs = true;
      setTimeout(() => this.shakeInputs = false, 300);
    }
  }

  register() {
    this.router.navigateByUrl('/register');
  }

  recover() {
    this.router.navigateByUrl('/recoverpasword');
  }
}