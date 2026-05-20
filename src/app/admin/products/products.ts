import { Component, inject, OnInit, signal } from '@angular/core';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUpRight, lucideFolderCode, lucidePencil, lucidePlus, lucideSquircleDashed, lucideTrash2 } from '@ng-icons/lucide';
import { ProductsService } from '../../core/services/products/products.service';
import { Category, Product } from '../../core/services/products/types';
import { Header } from "../../components/header/header";
import { hlmH4, hlmP } from '@spartan-ng/helm/typography';
import { HlmDialogImports } from "@spartan-ng/helm/dialog"
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmTextareaImports } from '@spartan-ng/helm/textarea';
import { HlmSelectImports } from '@spartan-ng/helm/select';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmAlertDialogImports } from '@spartan-ng/helm/alert-dialog';
import { toast } from '@spartan-ng/brain/sonner';


type SelectCategoriesType = {
  value: string,
  label: Category
}

@Component({
  selector: 'app-products',
  imports: [
    HlmTableImports,
    HlmButtonImports,
    NgIcon,
    Header,
    HlmEmptyImports,
    HlmAlertDialogImports,
    HlmDialogImports,
    HlmLabelImports,
    HlmInputImports,
    ReactiveFormsModule,
    HlmInputGroupImports,
    HlmTextareaImports,
    HlmSelectImports
  ],
  providers: [provideIcons({ lucidePencil, lucideTrash2, lucidePlus, lucideSquircleDashed })],
  templateUrl: './products.html',
})


export class Products implements OnInit {
  private readonly productsService = inject(ProductsService);
  readonly h4 = hlmH4
  readonly p = hlmP
  readonly products = signal<Product[]>([]);
  public portal: any;
  //Criei para usar o select, a lib de components pede
  public readonly categories: SelectCategoriesType[] = [
    { label: 'Geral', value: 'geral' },
    { label: 'Futebol', value: 'futebol' },
    { label: 'Tênis', value: 'tenis' },
    { label: 'Corrida', value: 'corrida' },
    { label: 'Basquete', value: 'basquete' },
  ];
  public readonly itemToString = (value: string) => this.categories.find((categories) => categories.value === value)?.label || '';

  constructor() { }
  productForm = new FormGroup({
    brand: new FormControl(undefined, [Validators.required]),
    category: new FormControl(undefined, [Validators.required]),
    description: new FormControl(undefined, [Validators.required]),
    name: new FormControl(undefined, [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    stock: new FormControl(0, [Validators.required, Validators.min(1)]),
  })

  ngOnInit(): void {
    this.productsService.getProducts().subscribe((products) => {
      this.products.set(products)
    })
  }

  protected createProduct() {
    if (this.productForm.valid) {
      this.productsService.createProduct({
        id: this.products().length + 1,
        brand: this.productForm.value.brand!,
        category: this.productForm.value.category!,
        description: this.productForm.value.description!,
        name: this.productForm.value.name!,
        price: this.productForm.value.price!,
        stock: this.productForm.value.stock!,
        userId: 1
      }).subscribe(() => {
        toast.success("Produto Adicionado", {
          description: `Produto criado com sucesso!`
        })
        setTimeout(() => window.location.reload(), 1500)
      })

    }
  }

  protected editProduct(id: number, product: Product): void {
    this.productsService.editProductById(id, product).subscribe(() => {
      window.location.reload()
    })
  }

  protected deleteProduct(id: number) {
    if (id) {
      this.productsService.deleteProductById(id).subscribe(() => {
        toast.success("Produto deletado", {
          description: "Produto deletado com sucesso!"
        })
        setTimeout(() => window.location.reload(), 1500)
      })

    }
  }
}
