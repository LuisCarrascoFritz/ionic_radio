import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DatabaseService } from './database';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  apiURL = 'https://api.mi-radio-app.com/api';
  httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  constructor(
    private http: HttpClient, 
    private router: Router,
    private dbService: DatabaseService 
  ) { }

  async register(datosUsuario: any): Promise<boolean> {
    return await this.dbService.crearUsuario(datosUsuario.email, datosUsuario.password);
  }

  async login(datosUsuario: any): Promise<boolean> {
    return await this.dbService.buscarUsuario(datosUsuario.email, datosUsuario.password);
  }


  async loginSuccess(token: string) {
    await this.dbService.guardarToken(token); 
  }


  async isAuthenticated(): Promise<boolean> {

    return await this.dbService.revisarToken(); 
  }

  async logout() {
    await this.dbService.borrarToken(); 
    this.router.navigate(['/login']);
  }
}