import { Component, OnInit } from '@angular/core';
import { data } from '../services/global';
import { SIMULA } from '../services/simula';

@Component({
  selector: 'products',
  templateUrl: '../views/products.html',
  styleUrls: ['../css/products.css']
})
export class ProductsComponent implements OnInit {
  public productos: any;
  public categorias: any;
  constructor() {}
  ngOnInit() {
    this.productos = SIMULA.productos;
    this.categorias = this.crearCategorias(SIMULA.catergorias);
  }
  crearCategorias(categorias){
    let listaCategorias = [];
    let cat = null;
    let sub = null;
    categorias.forEach(categoria => {
      if (categoria.padre == 'raiz') {
        cat = { name: categoria.name, id: categoria.id, subcategoria: [] }
        listaCategorias.push(cat);
      }else{
        listaCategorias.forEach(categoriaPadre => {
            if(categoriaPadre.name == categoria.padre){
              categoriaPadre.subcategoria.push(categoria.name);
            }
        });
      }
    });
    console.log(listaCategorias);
    return listaCategorias;
  }
}
