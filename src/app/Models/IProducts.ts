export interface IProducts {
  id: number;
  title: string;
  price: number;
  brand: string;
  category: string;
  image?: string;
  image_detail_1?: string;
  image_detail_2?: string;
  description: string;
  disableEdit: boolean;
  quantity?:number;
  totalPrice?:number
}
