import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { SIMULA } from '../services/simula';
import { UserService } from '../services/user.service';

@Component({
  selector: 'home',
  templateUrl: '../views/home.html',
  styleUrls: ['../css/home.css'],
  providers: [UserService]
})
export class HomeComponent implements OnInit {
  image = "./assets/image/countryUser.png"
  public tiposUsuario;
  public newUser : User;
  public id_user : string;
  public name : string;
  public email : string;
  public password : string;
  public passwordC : string;
  public phone : string;
  public type : string;
  public fcorreo : boolean;
  public fpws : boolean;
  public alertMensaje = {
    mensajePsw : null,
    tipoPsw : null,
    mensajeMail : null ,
    tipoMail : null,
    mensajeForm : null ,
    tipoForm : null
  };
  constructor(private _userService: UserService) {
    this.fcorreo = true;
    this.fpws = false;
    this.tiposUsuario = SIMULA.tiposUsuario;
    this.newUser = new User('','','','','','');
  }
  ngOnInit() {}


  createUser(){
    if(this.fcorreo && this.fpws){
      this.newUser.name = this.name;
      this.newUser.email = this.email
      this.newUser.password = this.password;
      this.newUser.phone = this.phone;
      this.newUser.type = this.type;
      this._userService.crearUsuario(this.newUser).subscribe(
        data => console.log(JSON.stringify(data)),
        error => alert(error),
        () => console.log("fin")
      );
    }else{
      this.alertMensaje.mensajeForm = 'Verifica que no falte ningun dato';
      this.alertMensaje.tipoForm ='alert-danger';
    }
  }
  // Verifica que el password este correctamente confirmado
  verificaPsw(){
    if(this.password != null && this.passwordC != null){
      if (this.password === this.passwordC) {
        this.alertMensaje.mensajePsw = 'La contaseña coincide';
        this.alertMensaje.tipoPsw ='alert-success';
        this.fpws = true;
      }else{
        this.alertMensaje.mensajePsw = 'La contaseña no coincide';
        this.alertMensaje.tipoPsw ='alert-danger';
        this.fpws = false;
      }
    }else{
      this.alertMensaje.mensajePsw = 'No has ingresado tu contraseña';
      this.alertMensaje.tipoPsw ='alert-danger';
      this.fpws = false;
    }
  }
  // Verifica que el correo sea valido y que no este registrado
  verificaMail(){
    let usuario = SIMULA.usuario;
    let mail = this.isValidEmail(this.email);
    let fcorreo = true;
    this.alertMensaje.mensajeMail = null;
    this.alertMensaje.tipoMail = null;
    if(mail){
      usuario.forEach(user => {
        if(user.correo == this.email){
          fcorreo = false;
        }
      });
      if (fcorreo) {
        this.alertMensaje.mensajeMail = 'El correo es Valido';
        this.alertMensaje.tipoMail ='alert-success';
      }else{
        this.alertMensaje.mensajeMail = 'El correo ya ha sido registrado';
        this.alertMensaje.tipoMail ='alert-danger';
      }
      this.fcorreo = fcorreo
      return this.fcorreo;
    }else{
      this.alertMensaje.mensajeMail = 'No has ingresado un correo valido';
      this.alertMensaje.tipoMail ='alert-danger';
    }
  }
  isValidEmail(mail) {
    return /^\w+([\.\+\-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail);
  }
}
