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
  imports: [CommonModule, FormsModule, IonItem, IonButton, IonInput, IonInputPasswordToggle, IonToast, RouterModule],
})
export class LoginPage implements OnInit {

  email = '';
  password = '';
  isToastOpen = false;
  shakeInputs = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  async login() {
    console.log('🔑 Iniciando sesión con:', this.email);

    // Usuario de prueba (opcional)
    if (this.email === 'test@test.com' && this.password === '123') {
      await this.authService.loginSuccess('test-fake-token');
      this.router.navigateByUrl('/main');
      return;
    }

    try {
      const ok = await this.authService.login({ email: this.email, password: this.password });
      if (ok) {
        await this.authService.loginSuccess(this.email);
        this.router.navigateByUrl('/main');
      } else {
        this.mostrarError();
      }
    } catch (error) {
      console.error('❌ Error al iniciar sesión:', error);
      this.mostrarError();
    }
  }

  mostrarError() {
    this.isToastOpen = true;
    this.shakeInputs = true;
    setTimeout(() => (this.shakeInputs = false), 300);
  }

  register() {
    this.router.navigateByUrl('/register');
  }

  recover() {
    this.router.navigateByUrl('/recoverpasword');
  }
}
