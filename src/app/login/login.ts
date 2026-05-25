import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from "@spartan-ng/helm/button"
import { HlmCardImports } from "@spartan-ng/helm/card"
import { HlmInputImports } from "@spartan-ng/helm/input"
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { UserService } from '../core/services/user/user.service';
import { AuthService } from '../core/services/auth/auth.service';
@Component({
  selector: 'app-login',
  imports: [HlmButtonImports, HlmCardImports, HlmInputImports, HlmLabelImports, RouterModule, ReactiveFormsModule],
  providers: [],
  templateUrl: './login.html',
})
export class Login {
  private userService = inject(UserService)
  private readonly router = inject(Router)
  private readonly authService = inject(AuthService)

  constructor() {
    //verifica se existe dados no local-storage, se existe, redireciona para a página de catálogo, ficand mais simples para o usuário
    if (this.authService.isAuthenticated()) {
      this.router.navigate(["/shop"])
    }
  }

  form = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)])
  })

  onSubmit() {
    if (!this.form.valid) {
      return
    }

    this.userService.getUsers().subscribe((users) => {
      //Busca na array de usuários do json-server se o usuário existe, se sim, fica salvo na variável
      const userExists = users.find(
        //Aqui valida o usuário passado no formulário com os usuários existentes no json-server
        (user) => user.email === this.form.value.email && user.password === this.form.value.password
      )

      if (userExists) {
        this.userService.changeUser({ email: userExists.email, password: userExists.password })
        this.router.navigate(["/shop"])
      } else {
        toast.info("Usuário não encontrado")
      }
    })
  }
}
