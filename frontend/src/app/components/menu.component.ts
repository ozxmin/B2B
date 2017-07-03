import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { Router } from '@angular/router';
import { SIMULA } from '../services/simula';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'menu-app',
  templateUrl: '../views/menu.html',
  styleUrls: ['../css/menu.css'],
  providers: [UserService]
})
export class MenuComponent implements OnInit {
  @Input() title: string;
  @Output() flagContent = new EventEmitter();
  flagLogin = false;
  public loginUser : User;
  public correo = null;
  public password = null;
  public alertMensaje = null;
  private token : any;
  // Iniciando Servicio de usuario
  constructor(private _router: Router,private _userService: UserService) {
    // Creando objeto para logear usuario
    this.loginUser = new User('','','','','','');
  }
  ngOnInit() {}

  // Login de usuario
  login(){
    // Mandando datos de usuario para logear al servicio 
    this._userService.loginUsuario(this.loginUser).subscribe(
      data => {
        // Resiviendo y guardando token
        this.token = data.tokens[data.tokens.length-1].token;
        console.log(this.token);
      },
      error => alert(error),
      () => console.log("fin")
    );
  }
  flagLog(flag){
    this.flagLogin = flag;
  }

  // Cerrando sesion de usuario
  logout(){
    // Peticion para eliminar token por medio del servicio usuario
    this._userService.logoutUser(this.token).subscribe(
      data => {
        this.token = null;
        this.loginUser.name = null;
        this.loginUser.password = null;
        console.log("sesión cerrada");
      },
      error => alert(error+" *"),
      () => console.log("fin")
    );
  }
  
  // Busqueda de productos
  buscar(busqueda){
    console.log(busqueda);
  }
}
