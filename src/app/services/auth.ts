import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';

export interface Usuario {
  id?: number;
  username: string;
  email: string;
  password?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private database?: SQLiteObject;
  private isDbReady = false;
  private currentUser?: Usuario;

  constructor(
    private sqlite: SQLite,
    private platform: Platform
  ) {
    this.initDB();
  }

  async initDB() {
    await this.platform.ready();
    
    try {
      this.database = await this.sqlite.create({
        name: 'radioapp.db',
        location: 'default'
      });

      await this.database.executeSql(
        `CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        []
      );

      this.isDbReady = true;
      console.log('Base de datos inicializada correctamente');
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
    }
  }

  async register(datosUsuario: { username: string; email: string; password: string }): Promise<boolean>;
  async register(username: string, email: string, password: string): Promise<boolean>;
  async register(
    usernameOrData: string | { username: string; email: string; password: string },
    email?: string,
    password?: string
  ): Promise<boolean> {
    if (!this.database) {
      console.error('Base de datos no inicializada');
      return false;
    }

    let username: string;
    let userEmail: string;
    let userPassword: string;

    if (typeof usernameOrData === 'object') {
      username = usernameOrData.username;
      userEmail = usernameOrData.email;
      userPassword = usernameOrData.password;
    } else {
      username = usernameOrData;
      userEmail = email!;
      userPassword = password!;
    }

    try {
      const userExists = await this.checkUserExists(username, userEmail);
      
      if (userExists) {
        console.log('El usuario o email ya existe');
        return false;
      }

      await this.database.executeSql(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, userEmail, userPassword]
      );
      
      console.log('Usuario registrado correctamente');
      return true;
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      return false;
    }
  }

  async checkUserExists(username: string, email: string): Promise<boolean> {
    if (!this.database) return false;

    try {
      const result = await this.database.executeSql(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, email]
      );
      
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      return false;
    }
  }

  async login(datosUsuario: { email: string; password: string }): Promise<boolean>;
  async login(usernameOrEmail: string, password: string): Promise<boolean>;
  async login(
    usernameOrData: string | { email: string; password: string },
    password?: string
  ): Promise<boolean> {
    if (!this.database) return false;

    let identifier: string;
    let userPassword: string;

    if (typeof usernameOrData === 'object') {
      identifier = usernameOrData.email;
      userPassword = usernameOrData.password;
    } else {
      identifier = usernameOrData;
      userPassword = password!;
    }

    try {
      const result = await this.database.executeSql(
        'SELECT * FROM users WHERE (username = ? OR email = ?) AND password = ?',
        [identifier, identifier, userPassword]
      );

      if (result.rows.length > 0) {
        const user = result.rows.item(0);
        this.currentUser = {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at
        };
        await this.loginSuccess(user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return false;
    }
  }

  async loginSuccess(usuario: Usuario): Promise<void> {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('currentUser', JSON.stringify(usuario));
    
    if (!this.currentUser && this.database) {
      try {
        const result = await this.database.executeSql(
          'SELECT * FROM users WHERE username = ? OR email = ?',
          [usuario.username, usuario.email]
        );
        
        if (result.rows.length > 0) {
          const user = result.rows.item(0);
          this.currentUser = {
            id: user.id,
            username: user.username,
            email: user.email,
            created_at: user.created_at
          };
        }
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      }
    }
  }

  async isAuthenticated(): Promise<boolean> {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  async obtenerUsuarioActual(): Promise<Usuario | null> {
    if (this.currentUser) {
      return this.currentUser;
    }

    const identifier = localStorage.getItem('currentUser');
    if (!identifier || !this.database) {
      return null;
    }

    try {
      const result = await this.database.executeSql(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [identifier, identifier]
      );

      if (result.rows.length > 0) {
        const user = result.rows.item(0);
        this.currentUser = {
          id: user.id,
          username: user.username,
          email: user.email,
          created_at: user.created_at
        };
        return this.currentUser;
      }
      
      return null;
    } catch (error) {
      console.error('Error al obtener usuario actual:', error);
      return null;
    }
  }

  async getUserData(): Promise<any> {
    try {
      await this.initDB();
      const user = await this.obtenerUsuarioActual();
      return user;
    } catch (error) {
      console.error('Error obteniendo datos del usuario:', error);
      return null;
    }
  }

  logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    this.currentUser = undefined;
  }

  async clearUsers() {
    if (!this.database) return;
    
    try {
      await this.database.executeSql('DELETE FROM users', []);
      console.log('Tabla de usuarios limpiada');
    } catch (error) {
      console.error('Error al limpiar usuarios:', error);
    }
  }
}