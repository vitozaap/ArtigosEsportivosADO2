

type Category = ["Futebol", "Basquete", "Corrida", "Tênis"]

export interface Product {
    name: string
    SKU: string
    brand: string
    category: Category
    price: number
    stock: number
    sizes: number[]
    description: string
}


