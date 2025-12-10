import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  private db: SQLiteObject | null = null;
  private isInitialized: boolean = false;
  private isMobile: boolean = false;
  private initPromise: Promise<void> | null = null;

  constructor(private sqlite: SQLite, private platform: Platform) {
    this.isMobile = this.platform.is('cordova') || this.platform.is('capacitor');
  }

  async crearBD() {
    // Evitar múltiples inicializaciones simultáneas
    if (this.initPromise) {
      return this.initPromise;
    }

    if (this.isInitialized) {
      console.log('Base de datos ya inicializada');
      return;
    }

    if (!this.isMobile) {
      console.log('No es plataforma móvil, saltando inicialización de SQLite');
      this.isInitialized = true;
      return;
    }

    this.initPromise = this.initializeDatabase();
    await this.initPromise;
    this.initPromise = null;
  }

  private async initializeDatabase() {
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
      
      await this.db.executeSql(
        'CREATE TABLE IF NOT EXISTS usuarios (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE, password TEXT)', []
      );
      console.log("Tabla 'usuarios' creada");
      
      this.isInitialized = true;
    } catch (e) {
      console.error("Error al crear la base de datos", e);
      this.isInitialized = false;
      throw e;
    }
  }

  async guardarToken(token: string) {
    if (!this.isMobile) {
      localStorage.setItem('token', token);
      return;
    }
    
    if (!this.db) {
      console.error('Base de datos no inicializada');
      return;
    }
    
    try {
      await this.db.executeSql('DELETE FROM sesion', []);
      await this.db.executeSql('INSERT INTO sesion (token) VALUES (?)', [token]);
      console.log('Token guardado en SQLite');
    } catch (e) {
      console.error('Error al guardar token en SQLite', e);
    }
  }

  async revisarToken(): Promise<boolean> {
    if (!this.isMobile) {
      return localStorage.getItem('token') !== null;
    }
    
    if (!this.db) {
      console.error('Base de datos no inicializada');
      return false;
    }
    
    try {
      const result = await this.db.executeSql('SELECT * FROM sesion', []);
      return result.rows.length > 0;
    } catch (e) {
      console.error('Error al revisar token en SQLite', e);
      return false;
    }
  }

  async borrarToken() {
    if (!this.isMobile) {
      localStorage.removeItem('token');
      return;
    }
    
    if (!this.db) return;
    
    try {
      await this.db.executeSql('DELETE FROM sesion', []);
      console.log('Token borrado de SQLite');
    } catch (e) {
      console.error('Error al borrar token en SQLite', e);
    }
  }

  async crearUsuario(email: string, password: string): Promise<boolean> {
    if (!this.isMobile) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const existe = usuarios.find((u: any) => u.email === email);
      if (existe) return false;
      usuarios.push({ email, password });
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      return true;
    }
    
    if (!this.db) return false;
    
    try {
      const existing = await this.db.executeSql('SELECT * FROM usuarios WHERE email = ?', [email]);
      if (existing.rows.length > 0) return false;
      await this.db.executeSql('INSERT INTO usuarios (email, password) VALUES (?, ?)', [email, password]);
      return true;
    } catch (e) {
      console.error('Error al crear usuario', e);
      return false;
    }
  }

  async buscarUsuario(email: string, password: string): Promise<boolean> {
    if (!this.isMobile) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      return usuarios.some((u: any) => u.email === email && u.password === password);
    }
    
    if (!this.db) return false;
    
    try {
      const result = await this.db.executeSql('SELECT * FROM usuarios WHERE email = ? AND password = ?', [email, password]);
      return result.rows.length > 0;
    } catch (e) {
      console.error('Error al buscar usuario', e);
      return false;
    }
  }

  async obtenerEmailActual(): Promise<string | null> {
    if (!this.isMobile) {
      return localStorage.getItem('token');
    }
    
    if (!this.db) {
      console.error('Base de datos no inicializada');
      return null;
    }
    
    try {
      const result = await this.db.executeSql('SELECT token FROM sesion LIMIT 1', []);
      if (result.rows.length > 0) {
        return result.rows.item(0).token;
      }
      return null;
    } catch (e) {
      console.error('Error al obtener email actual', e);
      return null;
    }
  }

  async obtenerDatosUsuario(email: string): Promise<any> {
    if (!this.isMobile) {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      return usuarios.find((u: any) => u.email === email) || null;
    }
    
    if (!this.db) return null;
    
    try {
      const result = await this.db.executeSql('SELECT id, email FROM usuarios WHERE email = ?', [email]);
      if (result.rows.length > 0) {
        return {
          id: result.rows.item(0).id,
          email: result.rows.item(0).email
        };
      }
      return null;
    } catch (e) {
      console.error('Error al obtener datos del usuario', e);
      return null;
    }
  }
}