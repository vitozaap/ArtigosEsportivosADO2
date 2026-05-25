import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from "@spartan-ng/helm/button"
import { HlmCardImports } from "@spartan-ng/helm/card"
import { HlmInputImports } from "@spartan-ng/helm/input"
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { UserService } from '../core/services/user/user.service';
import { admin, user } from '../core/users';
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
    if (this.authService.isAuthenticated()) {
      this.router.navigate(["/shop"])
    }
  }

  form = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)])
  })

  onSubmit() {
    if (this.form.valid) {
      const users = this.userService.getUser().subscribe()
      console.log(users)
      if (this.form.value.email == admin.email && this.form.value.password == admin.password) {
        this.userService.changeUser({ email: this.form.value.email!, password: this.form.value.password! })
        toast.success("Logado como admin!", {
          description: `Usuário salvo: 
          ${JSON.stringify(this.userService.getUser())}`
        })
        setTimeout(() => this.router.navigate(["/shop"]), 1000)
      }
      else if (this.form.value.email == user.email && this.form.value.password == user.password) {
        this.userService.changeUser({ email: this.form.value.email!, password: this.form.value.password! })
        toast.success("Logado como usuário!", {
          description: `Usuário salvo: 
          ${JSON.stringify(this.userService.getUser())}`
        })
        setTimeout(() => this.router.navigate(["/shop"]), 1000)
      }
      else {
        toast.info("Usuário não encontrado")
      }
    }
    else {
      toast.error("Form is invalid", { description: JSON.stringify(this.form.invalid) })
    }
  }
}
