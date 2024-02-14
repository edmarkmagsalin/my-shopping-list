export type Quantity = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type Type = 'Grocery' | 'Home Goods' | 'Hardware'


export type ShoppingItem = {
  id: number,
  name: string,
  type: Type
  quantity: Quantity
}