export interface Product {
  sku: number;
  name: string;
  type: string;
  description: string;
  image: string;
  deleted: number;
  price?: number;
}
