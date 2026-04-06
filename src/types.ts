export interface Product {
  id: string;
  name: string;
  price: string;
  discount?: string;
  imageUrl: string;
  tag?: string;
  description?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  imagePosition?: string;
}
