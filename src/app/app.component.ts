import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular/standalone';
import { DatabaseService } from './services/database';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private databaseService: DatabaseService
  ) {
    this.initializeApp();
  }

  /** 🔹 Inicializa la BD una vez que la plataforma está lista */
  async initializeApp() {
    try {
      await this.platform.ready();
      await this.databaseService.crearBD();
      console.log('✅ Base de datos inicializada correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar la base de datos:', error);
    }
  }
}
