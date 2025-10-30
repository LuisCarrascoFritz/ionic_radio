import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private db: SQLiteObject | null = null; 

  constructor(private sqlite: SQLite, private platform: Platform) {
  }


  async crearBD() {
    try {
      await this.platform.ready();
      this.db = await this.sqlite.create({
        name: 'sesion.db',
        location: 'default'
      });
      console.log("Base de datos creada");

      await this.db.executeSql(
        'CREATE TABLE IF NOT EXISTS sesion (token TEXT)', []
      );
      console.log("Tabla 'sesion' creada");

    } catch (e) {
      console.error("Ocurrió un error al crear la base de datos", e);
    }
  }


  async guardarToken(token: string) {
    if (!this.db) return;
    try {

      await this.db.executeSql('DELETE FROM sesion', []);

      await this.db.executeSql('INSERT INTO sesion (token) VALUES (?)', [token]);
      console.log('Token guardado en SQLite');
    } catch (e) {
      console.error('Error al guardar token en SQLite', e);
    }
  }


  async revisarToken(): Promise<boolean> {
    if (!this.db) return false; 
    try {
      const result = await this.db.executeSql('SELECT * FROM sesion', []);
      return result.rows.length > 0; 
    } catch (e) {
      console.error('Error al revisar token en SQLite', e);
      return false;
    }
  }

  async borrarToken() {
    if (!this.db) return;
    try {
      await this.db.executeSql('DELETE FROM sesion', []);
      console.log('Token borrado de SQLite');
    } catch (e) {
      console.error('Error al borrar token en SQLite', e);
    }
  }
}