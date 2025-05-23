export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number; // Timestamp for sorting or other future uses
}
