import { Component, inject, OnInit, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowRight, lucideSquircleDashed } from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { hlmH3, hlmH4, hlmP } from '@spartan-ng/helm/typography';
import { Header } from '../components/header/header';
import { ProductsService } from '../core/services/products/products.service';
import { Product } from '../core/services/products/types';

@Component({
  selector: 'app-shop',
  imports: [
    Header,
    NgIcon,
    HlmIcon,
    HlmButtonImports,
    HlmCardImports,
    HlmDialogImports,
    HlmEmptyImports,
  ],
  providers: [provideIcons({ lucideArrowRight, lucideSquircleDashed })],
  templateUrl: './shop.html',
})
export class Shop implements OnInit {
  private readonly productsService = inject(ProductsService);


  readonly h4 = hlmH4;
  readonly p = hlmP;

  readonly products = signal<Product[]>([]);

  // Roda SEMPRE que o componente é carregado
  ngOnInit(): void {

    //Busca os produtos na API, e atualizar a lista de produtos
    this.productsService.getProducts().subscribe((products) => {
      this.products.set(products);
    });
  }

  protected formatCategory(category: Product['category']): string {
    if (!category) return '';
    const str = category.toString();
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
}
