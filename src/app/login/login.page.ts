import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';
  isToastOpen: boolean = false;
  shakeInputs: boolean = false;
  showPassword: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login(event?: Event) {
    if (event) event.preventDefault();

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
        this.triggerError();
      }
    } catch (_) {
      this.triggerError();
    }
  }

  triggerError() {
    this.isToastOpen = true;
    this.shakeInputs = true;
    
    setTimeout(() => this.shakeInputs = false, 500);
    setTimeout(() => this.isToastOpen = false, 3000);
  }

  register() {
    this.router.navigateByUrl('/register');
  }

  recover() {
    this.router.navigateByUrl('/recoverpasword');
  }
}