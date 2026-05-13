import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { hlmH1, hlmH4, hlmP } from "@spartan-ng/helm/typography"
import { UserService } from '../../core/services/user/user.service';
import { User } from '../../core/services/user/types';
import { HlmAvatarImports } from "@spartan-ng/helm/avatar"
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HlmIcon } from '@spartan-ng/helm/icon'
import { lucideLogOut } from '@ng-icons/lucide';
interface HeaderItem {
  label: string
  path: string

}

@Component({
  selector: 'app-header',
  imports: [HlmButtonImports, RouterLink, HlmAvatarImports, NgIcon, HlmIcon],
  providers: [provideIcons({ lucideLogOut })],
  templateUrl: './header.html',
  template: `<h1 class="${hlmH1}">The Joke Tax Chronicles</h1>`
})
export class Header {

  private readonly userService = inject(UserService)
  readonly logoName = "PISTA"
  readonly logoClass = hlmH4

  readonly isAdmin = this.userService.isAdmin()
  readonly name = this.isAdmin ? "Admin" : "Usuário"
  readonly logoIcon = this.name.charAt(0)
  readonly adminHeaderItems: HeaderItem[] = [{
    label: "Ver Loja",
    path: "/shop"
  }, {
    label: "Produtos",
    path: "/admin/products"
  }]

}
