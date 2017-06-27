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
  constructor(private _router: Router,private _userService: UserService) {
    this.loginUser = new User('','','','','','');
  }
  ngOnInit() {}
  login(){
    this._userService.loginUsuario(this.loginUser).subscribe(
      data => {
        //console.log(JSON.stringify(data))
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
  logout(){
    this._userService.logoutUser(this.token).subscribe(
      data => {
        //console.log(JSON.stringify(data))
        this.token = null;
        this.loginUser.name = null;
        this.loginUser.password = null;
        console.log("sesión cerrada");
      },
      error => alert(error+" *"),
      () => console.log("fin")
    );
    // this._router.navigate(['/']);
  }
  verificaCorreo(email, password){
    // Conexion con el API
    let usuario = SIMULA.usuario;
    let userLog = null;
    let fcorreo = 0;
    let fpassword = 0;
    usuario.forEach(user => {
        if(user.correo == email){
          userLog = user;
          fcorreo = 1;
        }
    });
    if(password == userLog.password){
      fpassword = 1;
    }
    return fcorreo * fpassword;
  }
  buscar(busqueda){
    console.log(busqueda);
  }
}
