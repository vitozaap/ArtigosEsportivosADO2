import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { apiUrl } from "../../api";
import { Category, Product } from "./types";
import { Observable } from "rxjs";



@Injectable({
    providedIn: "root"
})
export class ProductsService {
    constructor(private readonly httpClient: HttpClient) { }

    getProducts(): Observable<Product[]> {
        return this.httpClient.get<Product[]>(apiUrl)
    }

    editProductById(id: number, product: Product): Observable<Product | undefined> {
        return this.httpClient.put<Product>(`${apiUrl}?id:eq=${id}`, product)
    }

    deleteProductById(id: number): Observable<Product | undefined> {
        return this.httpClient.delete<Product>(`${apiUrl}?id:eq=${id}`)
    }

    createProduct(product: Product): Observable<Product> {
        return this.httpClient.post<Product>(`${apiUrl}`, product)
    }

    getProductsByCategory(category: Category) {
        return this.httpClient.get<Product[]>(`${apiUrl}?category:eq=${category}`)
    }

}