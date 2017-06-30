import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Home
import { HomeComponent } from './components/home.component';
import { RecoverComponent } from './components/recover.component';
import { ProductsComponent } from './components/products.component';

const appRouters: Routes =[
  {path:'', component: HomeComponent},
  {path:'recupera-cuenta', component: RecoverComponent},
  {path:'productos', component: ProductsComponent},
  {path:'productos/:id', component: ProductsComponent},
  {path:'**', component: HomeComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRouters);
