export interface Order {
    orderId:string;
    title: string;
    content: string;
    imagePath: string;
    productId: string;
    userId: string;
    creator: string;
    price: number;
    actualPrice: number;
    noOfStocks: number;
    discountPercentage: number;
    address: string;
    additionalImages: Array<string>;
    orderStatus: Array<string>;
    refundStatus: string;
  }
