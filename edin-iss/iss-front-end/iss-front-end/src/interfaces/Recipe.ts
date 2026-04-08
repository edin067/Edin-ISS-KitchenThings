export interface Recipe {
  id: string;
  userId: string;
  title: string;
  description: string;
  imgUrl: string;
  cookingTime: string;
  steps: string;
  isCreatedByUser: boolean;
}
