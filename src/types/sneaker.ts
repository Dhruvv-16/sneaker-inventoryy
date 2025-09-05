export interface Sneaker {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: 'Running' | 'Casual' | 'Basketball';
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type SneakerFormData = Omit<Sneaker, 'id' | 'createdAt' | 'updatedAt'>;

export interface DashboardStats {
  totalProducts: number;
  totalStock: number;
  totalValue: number;
  averagePrice: number;
  lowStockCount: number;
}