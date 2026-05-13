import { Injectable } from "@angular/core";
import { User } from "../user/types";
import { STORAGE_KEY } from "../user/storage-key";
import { admin } from "../../users";
import { user as userData } from "../../users";
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    isAuthenticated() {
        const user: User = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{ "email": "", "password": ""}')

        if (!user.email && !user.password) {
            return false
        }
        return user.email == userData.email && user.password == userData.password || this.isAdmin()
    }

    isAdmin() {
        const user: User = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
        return user.email == admin.email && user.password == admin.password
    }
}