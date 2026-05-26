import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivateFn, createUrlTreeFromSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";


export const AuthGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) => {
    const authService: AuthService = inject(AuthService)
    if(!authService.isAuthenticated()) {
        return createUrlTreeFromSnapshot(route, ['/login'])
    }
    return authService.isAuthenticated()
}