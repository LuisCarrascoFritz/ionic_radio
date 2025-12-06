import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-recoverpasword',
  templateUrl: './recoverpasword.page.html',
  styleUrls: ['./recoverpasword.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class RecoverPaswordPage implements OnInit {

  email: string = '';
  isToastOpen: boolean = false;
  toastMessage: string = '';
  shakeInputs: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  async recover(event?: Event) {
    if (event) event.preventDefault();

    if (!this.email) {
      this.triggerError('El correo electrónico es requerido');
      return;
    }

    // Simulate password recovery
    this.toastMessage = 'Instrucciones enviadas a tu correo';
    this.isToastOpen = true;
    
    setTimeout(() => {
      this.isToastOpen = false;
      this.router.navigateByUrl('/login');
    }, 2000);
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
