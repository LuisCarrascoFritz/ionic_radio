import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;
  shakeInputs: boolean = false;
  isToastOpen: boolean = false;
  toastMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login(event: Event) {
    event.preventDefault();

    if (!this.email || !this.password) {
      this.mostrarToast('Por favor completa todos los campos');
      this.shakeInputs = true;
      setTimeout(() => this.shakeInputs = false, 500);
      return;
    }

    try {
      // El login retorna boolean, no un objeto usuario
      const loginExitoso = await this.authService.login(this.email, this.password);
      
      if (loginExitoso) {
        console.log('✅ Login exitoso');
        // El authService ya guardó el usuario internamente
        await this.router.navigate(['/main/home'], { replaceUrl: true });
      } else {
        console.log('❌ Credenciales inválidas');
        this.mostrarToast('Credenciales inválidas');
        this.shakeInputs = true;
        setTimeout(() => this.shakeInputs = false, 500);
      }
    } catch (error) {
      console.error('❌ Error durante el login:', error);
      this.mostrarToast('Error al intentar iniciar sesión');
      this.shakeInputs = true;
      setTimeout(() => this.shakeInputs = false, 500);
    }
  }

  register() {
    this.router.navigate(['/register']);
  }

  recover() {
    this.router.navigate(['/recoverpasword']);
  }

  async iniciarConDemo() {
    try {
      // Para demo, solo guardamos directamente
      const usuarioDemo = {
        id: 1,
        username: 'demo',
        email: 'demo@demo.com',
        created_at: new Date().toISOString()
      };
      
      // Guardar en localStorage
      localStorage.setItem('currentUser', JSON.stringify(usuarioDemo));
      localStorage.setItem('isAuthenticated', 'true');
      
      await this.router.navigate(['/main/home'], { replaceUrl: true });
    } catch (error) {
      console.error('❌ Error con demo:', error);
      this.mostrarToast('Error al iniciar con demo');
    }
  }

  mostrarToast(mensaje: string) {
    this.toastMessage = mensaje;
    this.isToastOpen = true;
    setTimeout(() => {
      this.isToastOpen = false;
    }, 3000);
  }
}