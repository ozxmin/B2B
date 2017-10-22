import { Component, OnInit, EventEmitter, Output } from '@angular/core';;
import { Router } from '@angular/router';
import { SIMULA } from '../services/simula';

@Component({
  selector: 'recover',
  templateUrl: '../views/recover.html',
  styleUrls: ['../css/recover.css']
})
export class RecoverComponent implements OnInit {
  @Output() flagRecover = new EventEmitter();
  public email;
  public message = null;
  image = "./assets/image/recoverUser.png";
  constructor(private _router: Router) {}
  ngOnInit() {}
  recover(){
    this.flagRecover.emit(false);
  }
  // Llamada al servicio para recuperar << pendiente >>
  recoverConfirm(email){
    if (!email.value) {
        this.message = {txt:'No ha introducido un correo valido',
        class:'alert-danger'};
    }else{
      if(this.verificaCorreo(email.value)){
        this.message = {txt:'Revise su cuenta de correo '+ email.value,
        class:'alert-success'};
        setTimeout(() => {
          this._router.navigate(['/']);
        }, 3000);
      }else{
        this.message = {txt:'El correo es Invalido',
        class:'alert-danger'};
      }
    }
  }
  
  // Verificar que el correo exista en la base de datos
  verificaCorreo(email){
    let usuario = SIMULA.usuario;
    let fcorreo = false;
    usuario.forEach(user => {
        if(user.correo == email){
          fcorreo = true;
        }
    });
    return fcorreo;
  }
}
