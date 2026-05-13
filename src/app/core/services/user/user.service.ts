import { inject, Injectable } from "@angular/core";
import { User } from "./types";
import { STORAGE_KEY } from "./storage-key";
import { AuthService } from "../auth/auth.service";



@Injectable({
    providedIn: "root"
})

// Criei esse serviço para poder alterar entre usuários (admin, normal) e para alterar renderizações de acordo com o usuário.
// Usei localStorage para salvar localmente os dados do usuário
export class UserService {
    private readonly authService = inject(AuthService)

    //Altera o usuário no LocalStorage, com base na KEY setada na raiz desse arquivo
    changeUser(user: User) {
        return localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }

    //Pega do localStorage o usuário "logado"
    getUser(): User {
        return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') ?? { email: '', password: '' };
    }


    //Deleta a KEY do localStorage
    deleteUser() {
        return localStorage.removeItem(STORAGE_KEY);
    }
}
