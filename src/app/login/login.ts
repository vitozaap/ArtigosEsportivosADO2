import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { toast } from '@spartan-ng/brain/sonner';
import { HlmButtonImports } from "@spartan-ng/helm/button"
import { HlmCardImports } from "@spartan-ng/helm/card"
import { HlmInputImports } from "@spartan-ng/helm/input"
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmToasterImports } from '@spartan-ng/helm/sonner';
import { UserService } from '../core/services/user/user.service';
@Component({
  selector: 'app-login',
  imports: [HlmButtonImports, HlmCardImports, HlmInputImports, HlmLabelImports, RouterModule, ReactiveFormsModule, HlmToasterImports],
  providers: [],
  templateUrl: './login.html',
})
export class Login {
  constructor(private router: Router, private userService: UserService) { }
  private admin = {
    email: "example@admin.com",
    password: "admin"
  }

  form = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)])
  })

  onSubmit() {
    if (this.form.valid) {
      this.userService.changeUser({ email: this.form.value.email!, password: this.form.value.password! })
      if (this.form.value.email == this.admin.email && this.form.value.password == this.admin.password) {
        toast.success("Logado como admin!", {
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
      toast.error("Form is invalid", { description: JSON.stringify(this.form.errors) })
    }
  }
}
