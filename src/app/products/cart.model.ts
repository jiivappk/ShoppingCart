export interface Cart {
    productId: string;
    userId: string;
    title: string;
    content: string;
    imagePath: string;
    creator: string;
    price: number, 
    actualPrice: number, 
    noOfStocks: number, 
    discountPercentage: number,
    deliveryPeriod: number,
    deliveryCharge: number,
    replacementPeriod: number,
    saveForLater: boolean
  }