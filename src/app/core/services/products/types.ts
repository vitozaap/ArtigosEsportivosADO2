

export type Category = "Futebol" | "Basquete" | "Corrida" | "Tênis" | "Geral" | undefined

export interface Product {
    id: string 
    name: string
    userId: number
    brand: any
    category: Category
    price: number
    stock: number

    description: string
}

