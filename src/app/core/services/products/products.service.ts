import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { apiUrl } from "../../api";
import { Category, Product } from "./types";
import { Observable } from "rxjs";



@Injectable({
    providedIn: "root"
})
export class ProductsService {
    private readonly httpClient = inject(HttpClient)
    constructor() { }

    getProducts(): Observable<Product[]> {
        return this.httpClient.get<Product[]>(apiUrl)
    }

    editProductById(id: string, product: Product): Observable<Product | undefined> {
        return this.httpClient.put<Product>(`${apiUrl}/${id}`, product)
    }

    deleteProductById(id: string): Observable<Product | undefined> {
        return this.httpClient.delete<Product>(`${apiUrl}/${id}`)
    }

    createProduct(product: Omit<Product, "id">): Observable<Product> {
        return this.httpClient.post<Product>(`${apiUrl}`, product)
    }

    getProductsByCategory(category: Category): Observable<Product[]> {
        return this.httpClient.get<Product[]>(`${apiUrl}?category:eq=${category}`)
    }

}