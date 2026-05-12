import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HlmButtonImports } from "@spartan-ng/helm/button"
import { HlmCardImports } from "@spartan-ng/helm/card"
import { HlmInputImports } from "@spartan-ng/helm/input"
import { HlmLabelImports } from '@spartan-ng/helm/label';
@Component({
  selector: 'app-login',
  imports: [HlmButtonImports, HlmCardImports, HlmInputImports, HlmLabelImports, RouterModule, ReactiveFormsModule],
  providers: [],
  templateUrl: './login.html',
})
export class Login {
  constructor(private router: Router) { }
  private admin = {
    email: "example@admin.com",
    password: "admin"
  }

  form = new FormGroup({
    email: new FormControl('', [Validators.email, Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)])
  })

  onSubmit() {
    console.log(this.form.value)
    if (this.form.valid) {
      if (this.form.value.email == this.admin.email && this.form.value.password == this.admin.password) {
        alert("logado como admin")
        this.router.navigate(['/'])
      }
    }
  }
}
