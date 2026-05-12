import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { apiUrl } from "../api";
import { Product } from "./types";



@Injectable({
    providedIn: "root"
})
export class ProductsService {
    constructor(private readonly httpClient: HttpClient) { }

    getAllProducts() {
        return this.httpClient.get<Product[]>(apiUrl)
    }

    editProductBySKU(SKU: string, product: Product) {
        return this.httpClient.put<Product>(`${apiUrl}/${SKU}`, product)
    }

}