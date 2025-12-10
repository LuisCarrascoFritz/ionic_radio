import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ]
})
export class RegisterPage {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  shakeInputs: boolean = false;
  isToastOpen: boolean = false;
  toastMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onRegister() {
    if (!this.email || !this.password || !this.confirmPassword) {
      this.showToast('Por favor completa todos los campos');
      this.triggerShake();
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showToast('Las contraseñas no coinciden');
      this.triggerShake();
      return;
    }

    if (this.password.length < 4) {
      this.showToast('La contraseña debe tener al menos 4 caracteres');
      this.triggerShake();
      return;
    }

    const datosUsuario = {
      username: this.email.split('@')[0],
      email: this.email,
      password: this.password
    };

    console.log('Intentando registrar usuario:', datosUsuario.email);

    const success = await this.authService.register(datosUsuario);

    if (success) {
      this.showToast('¡Registro exitoso!');
      console.log('Registro exitoso, redirigiendo a login');
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    } else {
      this.showToast('Error: El usuario ya existe');
      console.log('Error en el registro - Usuario ya existe');
      this.triggerShake();
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  private showToast(message: string) {
    this.toastMessage = message;
    this.isToastOpen = true;
    setTimeout(() => {
      this.isToastOpen = false;
    }, 3000);
  }

  private triggerShake() {
    this.shakeInputs = true;
    setTimeout(() => {
      this.shakeInputs = false;
    }, 500);
  }
}
