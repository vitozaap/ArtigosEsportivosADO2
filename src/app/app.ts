import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HlmToasterImports } from "@spartan-ng/helm/sonner"

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HlmToasterImports],

  template: `
  <router-outlet />
  <hlm-toaster position="bottom-center" />
    `,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ArtigosEsportivosADO2');
}
