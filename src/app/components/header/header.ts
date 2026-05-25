import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { hlmH4 } from "@spartan-ng/helm/typography"
import { UserService } from '../../core/services/user/user.service';
import { HlmAvatarImports } from "@spartan-ng/helm/avatar"
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon'
import { lucideLogOut, lucideMoon, lucideSun } from '@ng-icons/lucide';
import { AuthService } from '../../core/services/auth/auth.service';
import { ThemeService } from '../../core/services/theme/theme.service';
interface HeaderItem {
  label: string
  path: string

}

@Component({
  selector: 'app-header',
  imports: [HlmButtonImports, RouterLink, HlmAvatarImports, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideLogOut, lucideMoon, lucideSun })],
  templateUrl: './header.html',
})
export class Header {

  protected readonly userService = inject(UserService)
  protected readonly authService = inject(AuthService)
  protected readonly themeService = inject(ThemeService)
  readonly logoName = "PISTA"
  readonly logoClass = hlmH4

  readonly isAdmin = this.authService.isAdmin()
  readonly name = this.isAdmin ? "Admin" : "Usuário"
  readonly logoIcon = this.name.charAt(0)
  readonly adminHeaderItems: HeaderItem[] = [{
    label: "Ver Loja",
    path: "/shop"
  }, {
    label: "Produtos",
    path: "/admin/products"
  }]
  readonly userHeaderItems: HeaderItem[] = [{
    label: "Catálogo",
    path: "/shop",
  }]

}
