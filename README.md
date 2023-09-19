# ShoppingCart
e-commerce app

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


DB Details:

MngoDb is used here.

Following Colections are used:

1. cart

To store the items stored in cart.

Sample Data:

{
  "_id": {
    "$oid": "643188dcf6aee91f1cb48492"
  },
  "title": "laptop",
  "content": "Laptop  with details",
  "imagePath": "http://localhost:3000/images/laptop-1652020396342.jpg",
  "productId": {
    "$oid": "6277d4acd7e84537ec6c0b4e"
  },
  "creator": {
    "$oid": "61a32304b5697328b839b54d"
  },
  "userId": {
    "$oid": "643106380209e138c0fb35f7"
  },
  "price": 500,
  "actualPrice": 999,
  "noOfStocks": 5,
  "discountPercentage": 49.949949949949946,
  "deliveryPeriod": 12,
  "deliveryCharge": 0,
  "replacementPeriod": 10,
  "saveForLater": false,
  "__v": 0
}

2. order

To store the orders placed.

Sample Data:

{
  "_id": {
    "$oid": "641de2b8a1e2f44098e77a81"
  },
  "additionalImages": [
    "http://localhost:3000/images/car-1652015641436.jpg",
    "http://localhost:3000/images/car-1652015641447.jpg",
    "http://localhost:3000/images/car-1652015641464.jpg",
    "http://localhost:3000/images/car-1652015641471.jpg",
    "http://localhost:3000/images/car-1652015641473.jpg"
  ],
  "orderInfo": [
    {
      "content": "Ordered",
      "date": "15/02/2022 10.30",
      "status": "success"
    },
    {
      "content": "Processing",
      "date": "15/02/2022 14.00",
      "status": "success"
    },
    {
      "content": "Shipped",
      "date": "16/02/2022 10.30",
      "status": "success"
    },
    {
      "content": "Delivered",
      "date": "20/02/2022 10.30",
      "status": "success"
    },
    {
      "content": "Cancelled",
      "date": "11/03/2022 12.30",
      "status": "inProgress"
    }
  ],
  "title": "Car",
  "content": "Car with details",
  "imagePath": "http://localhost:3000/images/car-1652015641423.jpg",
  "productId": {
    "$oid": "6277c219d7e84537ec6c0b33"
  },
  "creator": {
    "$oid": "61a32304b5697328b839b54d"
  },
  "userId": {
    "$oid": "6407f50e1289092ff45efe23"
  },
  "price": 1000,
  "actualPrice": 2000,
  "noOfStocks": 5,
  "discountPercentage": 50,
  "deliveryAddress": {
    "area": "sdsa",
    "alternateMobileNumber": "asd",
    "locality": "kjihu",
    "name": "Jii",
    "landMark": "asd",
    "mobile": "7894561235",
    "pinCode": "123456",
    "state": "Goa",
    "town": "jsiad",
    "addressType": "home"
  },
  "orderStatus": "Delivered",
  "refundStatus": "NA",
  "__v": 0
}

3. product-qa

To store the product Q&A section.

Sample Data:

4. productreviews

To store the product reviews by users.

Sample Data:

{
  "_id": {
    "$oid": "643ad9ab3407ac5490deb0d4"
  },
  "images": [
    "http://localhost:3000/images/car-1682442093030.jpg",
    "http://localhost:3000/images/car-1682442093032.jpg",
    "http://localhost:3000/images/car-1682442093050.jpg"
  ],
  "productId": {
    "$oid": "6277c219d7e84537ec6c0b33"
  },
  "productTitle": "Car",
  "userId": {
    "$oid": "643106380209e138c0fb35f7"
  },
  "userName": "Jeeva N",
  "profilePic": "",
  "ratingScale": "4",
  "comment": "Excellent Product by gmail user",
  "__v": 0
}

5. products

To store the Products uploaded by sellers.

Sample Data:

{
  "_id": {
    "$oid": "6277c219d7e84537ec6c0b33"
  },
  "additionalImages": [
    "http://localhost:3000/images/car-1652015641436.jpg",
    "http://localhost:3000/images/car-1652015641447.jpg",
    "http://localhost:3000/images/car-1652015641464.jpg",
    "http://localhost:3000/images/car-1652015641471.jpg",
    "http://localhost:3000/images/car-1652015641473.jpg"
  ],
  "title": "Car",
  "content": "Car with details",
  "category": "car",
  "imagePath": "http://localhost:3000/images/car-1652015641423.jpg",
  "creator": {
    "$oid": "61a32304b5697328b839b54d"
  },
  "price": 1000,
  "actualPrice": 2000,
  "noOfStocks": 5,
  "discountPercentage": 50,
  "deliveryPeriod": 12,
  "deliveryCharge": 0,
  "replacementPeriod": 10,
  "__v": 0
}

6. users

To store User details.

Sample Data:

{
  "_id": {
    "$oid": "643106380209e138c0fb35f7"
  },
  "address": [],
  "email": "jeevananthann97@gmail.com",
  "password": "$2a$10$hyN9MlqUyB/uZLImRAfLNePNRGKWe7o/KrJYMv1fBWmKoSedL2gYW",
  "firstName": "Jeeva",
  "lastName": "N",
  "phoneNumber": "9789687988",
  "gender": "Male",
  "dob": "06/11/1997",
  "profilePic": "",
  "oldEmailToken": "",
  "newEmailToken": "",
  "passwordResetToken": "",
  "__v": 0
}

7. wishlist

To store Wishlist of each individual users.

Sample Data:

{
  "_id": {
    "$oid": "643aa88b2a5679463479bcf8"
  },
  "title": "Bike",
  "content": "Bike for sale",
  "imagePath": "http://localhost:3000/images/bike-1680516369965.jpg",
  "productId": {
    "$oid": "642aa512b85a0929f02a5fcf"
  },
  "creator": {
    "$oid": "6407f50e1289092ff45efe23"
  },
  "userId": {
    "$oid": "643106380209e138c0fb35f7"
  },
  "price": 200000,
  "actualPrice": 250000,
  "noOfStocks": 7,
  "discountPercentage": 20,
  "__v": 0
}



