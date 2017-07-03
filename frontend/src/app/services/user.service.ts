import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

// Archivo de configuracion
import { data } from './global';

@Injectable()

export class UserService{

    public url : string;

    // Inicializando servicios HTTP
    constructor ( private _http : Http) {
        // Opteniendo ruta del API
        this.url = data.url;
    }
    // llamada al API para cerrar sesión
    public logoutUser(token){
      const h = new Headers({"x-auth": String(token)})
      return this._http.delete(this.url+"logout",
        new RequestOptions({headers:h}));
    }
    // llamada al API para crear nuevo usuario
    public crearUsuario (user) {
        let nUser = {
	        "user": user.name,
	        "password": user.password,
	        "email": user.email,
          "celular": user.phone
        };

        let params = JSON.stringify(nUser);

        console.log(params);

        let headers = new Headers;
        headers.append("Content-Type","application/json");

        // Envio de datos
        return this._http.post(this.url+"creaUsuario",params,{headers:headers}).map(res=>res.json());
    }
    // llamada al API para logear a un usuario registrado
    public loginUsuario (user) {
        let nUser = {
	        "user": user.name,
	        "password": user.password
        };

        let params = JSON.stringify(nUser);

        let headers = new Headers;
        headers.append("Content-Type","application/json");

        // Envio de datos
        return this._http.post(this.url+"login",params,{headers:headers}).map(res=>res.json());
    }

}
