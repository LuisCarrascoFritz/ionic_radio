import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonToast, IonItem, IonButton, IonInputPasswordToggle, IonInput } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonItem, IonButton, IonInput, IonInputPasswordToggle, IonToast]
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';
  isToastOpen: boolean = false;
  shakeInputs: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
  }

  login() {
    console.log(this.email);
    console.log(this.password);

    if (this.email === 'jesus.vargas@tinet.cl' && this.password === '123456') {
      this.router.navigateByUrl('/main');
    } else {
      this.isToastOpen = true;
            // Activar animación
            this.shakeInputs = true;
            this.isToastOpen = true;
      
            // Quitar animación después de 300ms
            setTimeout(() => this.shakeInputs = false, 300);
    }
  }
  register() {
    this.router.navigateByUrl('/register');
  }
}