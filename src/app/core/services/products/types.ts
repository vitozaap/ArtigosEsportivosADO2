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

export interface CategoryOption {
    value: string
    label: Category
}

export const categories: CategoryOption[] = [
    { label: 'Geral', value: 'geral' },
    { label: 'Futebol', value: 'futebol' },
    { label: 'Tênis', value: 'tenis' },
    { label: 'Corrida', value: 'corrida' },
    { label: 'Basquete', value: 'basquete' },
];
