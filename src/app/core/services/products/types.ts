

export type Category = "Futebol" | "Basquete" | "Corrida" | "Tênis" | "Geral" | undefined

export interface Product {
    id: number
    name: string
    userId: number
    brand: string
    category: Category
    price: number
    stock: number

    description: string
}

