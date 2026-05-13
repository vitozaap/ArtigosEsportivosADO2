

type Category = ["Futebol", "Basquete", "Corrida", "Tênis"]

export interface Product {
    name: string
    userId: number
    SKU: string
    brand: string
    category: Category
    price: number
    stock: number
    sizes: number[]
    description: string
}


