import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { DatabaseService } from './services/database'; // <-- 1. IMPORTA

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  // 2. INYECTA EL SERVICIO
  constructor(private databaseService: DatabaseService) {
    this.inicializarBD(); // <-- 3. LLAMA AL MÉTODO
  }

  // 4. CREA EL MÉTODO (como en tu PDF 1)
  async inicializarBD() {
    await this.databaseService.crearBD();
  }
}