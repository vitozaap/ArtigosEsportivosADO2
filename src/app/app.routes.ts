import { Routes } from '@angular/router';
import { Login } from './login/login';
import { App } from './app';
import { Shop } from './shop/shop';

export const routes: Routes = [
    { path: '', component: App },
    { path: 'login', component: Login },
    { path: 'shop', component: Shop }
];
