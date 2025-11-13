import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private db: SQLiteObject | null = null;

  constructor(private sqlite: SQLite, private platform: Platform) {}

  /** 🔹 Crea la base de datos y las tablas necesarias */
  async crearBD() {
    try {
      await this.platform.ready();

      if (this.db) {
        console.log('✅ Base de datos ya inicializada');
        return;
      }

      this.db = await this.sqlite.create({
        name: 'sesion.db',
        location: 'default'
      });

      console.log('✅ Base de datos creada / abierta');

      // Crear tablas
      await this.db.executeSql(
        'CREATE TABLE IF NOT EXISTS sesion (token TEXT)',
        []
      );
      await this.db.executeSql(
        `CREATE TABLE IF NOT EXISTS usuarios (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE,
          password TEXT
        )`,
        []
      );

      console.log('✅ Tablas listas (sesion, usuarios)');
    } catch (e) {
      console.error('❌ Error al crear la base de datos', e);
    }
  }

  /** 🔹 Guarda el token de sesión (por ejemplo, email del usuario) */
  async guardarToken(token: string) {
    if (!this.db) return;
    try {
      await this.db.executeSql('DELETE FROM sesion', []);
      await this.db.executeSql('INSERT INTO sesion (token) VALUES (?)', [token]);
      console.log('✅ Token guardado en SQLite');
    } catch (e) {
      console.error('❌ Error al guardar token', e);
    }
  }

  /** 🔹 Verifica si existe token (sesión activa) */
  async revisarToken(): Promise<boolean> {
    if (!this.db) return false;
    try {
      const result = await this.db.executeSql('SELECT * FROM sesion', []);
      return result.rows.length > 0;
    } catch (e) {
      console.error('❌ Error al revisar token', e);
      return false;
    }
  }

  /** 🔹 Elimina el token (cerrar sesión) */
  async borrarToken() {
    if (!this.db) return;
    try {
      await this.db.executeSql('DELETE FROM sesion', []);
      console.log('🚪 Token borrado, sesión cerrada');
    } catch (e) {
      console.error('❌ Error al borrar token', e);
    }
  }

  /** 🔹 Crea un nuevo usuario */
  async crearUsuario(email: string, password: string): Promise<boolean> {
    if (!this.db) return false;
    try {
      const existe = await this.db.executeSql('SELECT * FROM usuarios WHERE email = ?', [email]);
      if (existe.rows.length > 0) {
        console.warn('⚠️ El usuario ya existe:', email);
        return false;
      }
      await this.db.executeSql('INSERT INTO usuarios (email, password) VALUES (?, ?)', [email, password]);
      console.log('✅ Usuario creado correctamente:', email);
      return true;
    } catch (e) {
      console.error('❌ Error al crear usuario', e);
      return false;
    }
  }

  /** 🔹 Busca un usuario con email y password */
  async buscarUsuario(email: string, password: string): Promise<boolean> {
    if (!this.db) return false;
    try {
      const result = await this.db.executeSql('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password]);
      const encontrado = result.rows.length > 0;
      console.log(encontrado ? '✅ Usuario encontrado' : '❌ Usuario no encontrado');
      return encontrado;
    } catch (e) {
      console.error('❌ Error al buscar usuario', e);
      return false;
    }
  }
}
