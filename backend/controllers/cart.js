const Cart = require("../models/cart");

exports.createCartItem = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  let fetchedCartItems;
  const cartItem = new Cart({
    title: req.body.title,
    content: req.body.content,
    imagePath: req.body.imagePath,
    productId: req.body.productId,
    creator: req.body.creator,
    userId: req.body.userId,
    price: req.body.price,
    actualPrice: req.body.actualPrice,
    noOfStocks: req.body.noOfStocks,
    discountPercentage: req.body.discountPercentage,
    deliveryPeriod: req.body.deliveryPeriod,
    deliveryCharge: req.body.deliveryCharge,
    replacementPeriod: req.body.replacementPeriod,
    saveForLater: req.body.saveForLater
  });
  cartItem
    .save()
    .then((documents)=>{
      fetchedCartItems = documents;
      console.log("FetchedCartItems",fetchedCartItems)
      return Cart.count();
    })
    .then(count => {
      
      res.status(201).json({
        message: "createdCartItem added successfully",
        cartItem: fetchedCartItems,
        maxCartItems: count
      });
    })
    .catch(error => {
      console.log("Error occured while saving  to cartitem", error);
      res.status(500).json({
        message: "Creating a CartItem failed!"
      });
    });
};

// exports.getCartItems = (req, res, next) => {
//   const pageSize = +req.query.pagesize;
//   const currentPage = +req.query.page;
//   const cartQuery = Cart.find();
//   let fetchedCartItems;
//   if (pageSize && currentPage) {
//     cartQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
//   }
//   cartQuery
//     .then(documents => {
//       fetchedCartItems = documents;
//       return Cart.count();
//     })
//     .then(count => {
//       res.status(200).json({
//         message: "Cart Items fetched successfully!",
//         cartItems: fetchedCartItems,
//         maxCartItems: count
//       });
//     })
//     .catch(error => {
//       res.status(500).json({
//         message: "Fetching Cart Items failed!"
//       });
//     });
// };

exports.getCartItems = (req, res, next) => {
  const cartQuery = Cart.find();
  let fetchedCartItems;
  cartQuery
    .then(documents => {
      fetchedCartItems = documents;
      return Cart.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Cart Items fetched successfully!",
        cartItems: fetchedCartItems,
        maxCartItems: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching Cart Items failed!"
      });
    });
};

exports.updateCartItem = (req, res, next) => {
  const cartItem = new Cart({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: req.body.imagePath,
    price: req.body.price,
    actualPrice: req.body.actualPrice,
    noOfStocks: req.body.noOfStocks,
    discountPercentage: req.body.discountPercentage,
    productId: req.body.productId,
    userId: req.body.userId,
    creator: req.body.creator,
    deliveryPeriod: req.body.deliveryPeriod, 
    deliveryCharge: req.body.deliveryCharge,
    replacementPeriod: req.body.replacementPeriod,
    saveForLater: req.body.saveForLater
  });
  Cart.updateOne({ _id: req.params.id, creator: req.userData.userId }, cartItem)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate cart item!"
      });
    });
};

exports.deleteCartItem = (req, res, next) => {
  Cart.deleteOne({ _id: req.params.id, userId: req.userData.userId })
    .then(result => {
      console.log(result);
      if (result.n > 0) {
        res.status(200).json({ message: "Deletion successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Deleting Cart Item failed!"
      });
    });
};
