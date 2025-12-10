import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircle, musicalNotes } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon]
})
export class HomePage {
  constructor(private router: Router) {
    addIcons({ personCircle, musicalNotes });
    console.log('HomePage constructor - Router inyectado');
  }

  goToProfile() {
    console.log('🔵 Navegando a profile desde home');
    console.log('URL actual:', this.router.url);
    this.router.navigate(['/main/profile']).then(success => {
      console.log('Navegación exitosa:', success);
    }).catch(err => {
      console.error('Error en navegación:', err);
    });
  }
}
