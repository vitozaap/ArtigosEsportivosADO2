import { Component, inject, OnInit, signal } from '@angular/core';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePencil, lucidePlus, lucideSquircleDashed, lucideTrash2 } from '@ng-icons/lucide';
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

  editProductForm = new FormGroup({
    brand: new FormControl(),
    category: new FormControl(),
    description: new FormControl(),
    name: new FormControl(),
    price: new FormControl(),
    stock: new FormControl(),
  })

  ngOnInit(): void {
    this.productsService.getProducts().subscribe((products) => {
      this.products.set(products)
    })
  }

  resetarEditForm() {
    this.editProductForm.reset()
  }

  protected createProduct() {

    if (this.productForm.valid) {
      this.productsService.createProduct({
        brand: this.productForm.value.brand!,
        category: this.productForm.value.category!,
        description: this.productForm.value.description!,
        name: this.productForm.value.name!,
        price: this.productForm.value.price!,
        stock: this.productForm.value.stock!,
        userId: 1
      }).subscribe(() => {
        toast.success("Produto adicionado", {
          description: `Produto criado com sucesso!`
        })
        setTimeout(() => window.location.reload(), 1500)
      })

    }
  }

  protected editProduct(prevData: Product): void {
    if (this.editProductForm.valid) {
      console.log(this.editProductForm.value)
      this.productsService.editProductById(prevData.id, {
        brand: this.editProductForm.value.brand ? this.editProductForm.value.brand : prevData.brand,
        category: this.editProductForm.value.category! ? this.editProductForm.value.category! : prevData.category,
        description: this.editProductForm.value.description! ? this.editProductForm.value.description! : prevData.description,
        name: this.editProductForm.value.name! ? this.editProductForm.value.name! : prevData.name,
        price: this.editProductForm.value.price! ? this.editProductForm.value.price! : prevData.price,
        stock: this.editProductForm.value.stock! ? this.editProductForm.value.stock! : prevData.stock,
        userId: 1,
        id: prevData.id,
      }).subscribe(() => {
        toast.success("Produto editado", {
          description: "Produto editado com sucesso!"
        })
        setTimeout(() => window.location.reload(), 1500)
      })
    }
  }

  protected deleteProduct(id: string) {
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
