import { inject, Injectable } from "@angular/core";
import { User } from "./types";
import { STORAGE_KEY } from "./storage-key";
import { AuthService } from "../auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { apiUrl } from "../../api";
import { Observable } from "rxjs";



@Injectable({
    providedIn: "root"
})

//Para contexto, precisei do localStorage para que eu pudesse garantir que o usuário está logado, como se fosse "cookies", nao apenas so buscando no servidor.
export class UserService {
    private readonly httpClient = inject(HttpClient)
    //Altera o usuário no LocalStorage, com base na KEY setada na raiz desse arquivo
    changeUser(user: User) {
        return localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }

    //Pega do localStorage o usuário "logado"
    getUser(): Observable<User[]> {
        console.log(`${apiUrl}/users`)
        return this.httpClient.get<User[]>(`${apiUrl}/users`)
    }


    //Deleta a KEY do localStorage
    deleteUser() {
        return localStorage.removeItem(STORAGE_KEY);
    }
}
