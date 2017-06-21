export class Product {
    constructor(
      public id_producto: string,
      public nombreProducto: string,
      public descripcion: string,
      public ventaMinima: string,
      public agregado: string,
      public precio: number,
      public fichaTech: string,
      public inventario: number,
      public fotos: string[],
      public estado: boolean,
      public categoria: string,
      public subCategoria: string[]
    ){}
}
