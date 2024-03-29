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
    deliveryAddress: string;
    additionalImages: Array<string>;
    orderInfo: Array<string>;
    orderStatus: string;
    refundStatus: string;
  }
