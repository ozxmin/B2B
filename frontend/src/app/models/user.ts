// Model de Usuario para empatar con la base de datos
export class User {
    constructor(
      public id_user: string,
      public name: string,
      public email: string,
      public password: string,
      public phone: string,
      public type: string
    ){}
}