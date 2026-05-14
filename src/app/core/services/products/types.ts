

export type Category = ["Futebol", "Basquete", "Corrida", "Tênis"]

export interface Product {
    id: number
    name: string
    userId: number
    brand: string
    category: Category
    price: number
    stock: number
    sizes: number[]
    description: string
}


