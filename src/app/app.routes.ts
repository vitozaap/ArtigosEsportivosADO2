import { Routes } from '@angular/router';
import { Login } from './login/login';
import { App } from './app';
import { Shop } from './shop/shop';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminAuthGuard } from './core/guards/admin.guard';

export const routes: Routes = [
    { path: '', component: App },
    { path: 'login', component: Login, },
    { path: 'admin/products', component: App, canActivate: [AdminAuthGuard] },
    { path: 'shop', component: Shop, canActivate: [AuthGuard] }
];
