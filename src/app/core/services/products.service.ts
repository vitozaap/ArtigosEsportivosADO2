import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { apiUrl } from "../api";
import { Product } from "./types";
import { Observable } from "rxjs";



@Injectable({
    providedIn: "root"
})
export class ProductsService {
    constructor(private readonly httpClient: HttpClient) { }

    getProducts(): Observable<Product[]> {
        return this.httpClient.get<Product[]>(apiUrl)
    }

    editProductBySKU(SKU: string, product: Product): Observable<Product | undefined> {
        return this.httpClient.put<Product>(`${apiUrl}/${SKU}`, product)
    }

    deleteProductBySKU(SKU: string): Observable<Product | undefined> {
        return this.httpClient.delete<Product>(`${apiUrl}/${SKU}`)
    }

    createProduct(product: Product): Observable<Product> {
        return this.httpClient.post<Product>(`${apiUrl}`, product)
    }

}