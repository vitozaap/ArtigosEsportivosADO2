import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "./types";
import { STORAGE_KEY } from "./storage-key";
import { apiUrl } from "../../api";


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

    //Busca a lista de usuários cadastrados no json-server
    getUsers(): Observable<User[]> {
        return this.httpClient.get<User[]>(`${apiUrl}/users`)
    }

    //Deleta a KEY do localStorage
    deleteUser() {
        return localStorage.removeItem(STORAGE_KEY);
    }
}
