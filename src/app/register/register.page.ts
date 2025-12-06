import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RegisterPage implements OnInit {

  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  isToastOpen: boolean = false;
  toastMessage: string = '';
  shakeInputs: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  async register(event?: Event) {
    if (event) event.preventDefault();

    if (!this.email || !this.password || !this.confirmPassword) {
      this.triggerError('Todos los campos son requeridos');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.triggerError('Las contraseñas no coinciden');
      return;
    }

    const datosUsuario = { email: this.email, password: this.password };
    
    try {
      const success = await this.authService.register(datosUsuario);
      
      if (success) {
        this.toastMessage = 'Usuario registrado exitosamente';
        this.isToastOpen = true;
        setTimeout(() => {
          this.isToastOpen = false;
          this.router.navigateByUrl('/login');
        }, 2000);
      } else {
        this.triggerError('El usuario ya existe');
      }
    } catch (_) {
      this.triggerError('Error al registrar usuario');
    }
  }

  triggerError(message: string) {
    this.toastMessage = message;
    this.isToastOpen = true;
    this.shakeInputs = true;
    
    setTimeout(() => this.shakeInputs = false, 500);
    setTimeout(() => this.isToastOpen = false, 3000);
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}
