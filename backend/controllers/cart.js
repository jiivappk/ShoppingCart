const Cart = require("../models/cart");

exports.createCartItem = (req, res, next) => {
  console.log("Request for cartitem Controller is",req);
  const url = req.protocol + "://" + req.get("host");
  let fetchedCartItems;
  console.log("url is ",url);
  const cartItem = new Cart({
    title: req.body.title,
    content: req.body.content,
    imagePath: req.body.imagePath,
    productId: req.body.productId,
    creator: req.body.creator,
    userId: req.body.userId
  });
  cartItem
    .save()
    .then((documents)=>{
      this.fetchedCartItems = documents;
      console.log("FetchedCartItems",this.fetchedCartItems)
      return Cart.count();
    })
    .then(count => {
      
      res.status(201).json({
        message: "createdCartItem added successfully",
        cartItem: this.fetchedCartItems,
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

exports.getCartItems = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const cartQuery = Cart.find();
  let fetchedCartItems;
  if (pageSize && currentPage) {
    cartQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
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
