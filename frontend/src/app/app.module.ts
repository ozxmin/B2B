import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Declaració de el manejador de rutas
import { appRoutingProviders, routing } from './app.routing';
import { AppComponent } from './app.component';
// Declaración Componente menu
import { MenuComponent } from './components/menu.component';
// Declaración Componente home
import { HomeComponent } from './components/home.component';
// Declaración Componente recover: Recuperar contraseña de cuenta
import { RecoverComponent } from './components/recover.component';
// Declaración Componente products: Listar productos
import { ProductsComponent } from './components/products.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HomeComponent,
    RecoverComponent,
    ProductsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
