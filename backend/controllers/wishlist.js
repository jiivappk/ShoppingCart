const Wishlist = require("../models/wishlist");

exports.createWishlistItem = (req, res, next) => {
  console.log("Request for wishlistitem Controller is",req);
  const url = req.protocol + "://" + req.get("host");
  let fetchedWishlistItems;
  console.log("url is ",url);
  const wishlistItem = new Wishlist({
    title: req.body.title,
    content: req.body.content,
    imagePath: req.body.imagePath,
    productId: req.body.productId,
    creator: req.body.creator,
    userId: req.body.userId,
    price: req.body.price,
    actualPrice: req.body.actualPrice,
    noOfStocks: req.body.noOfStocks,
    discountPercentage: req.body.discountPercentage
  });
  wishlistItem
    .save()
    .then((documents)=>{
      fetchedWishlistItems = documents;
      console.log("FetchedWishlistItems",fetchedWishlistItems)
      return Wishlist.count();
    })
    .then(count => {
      
      res.status(201).json({
        message: "createdWishlistItem added successfully",
        wishlistItem: fetchedWishlistItems,
        maxWishlistItems: count
      });
    })
    .catch(error => {
      console.log("Error occured while saving  to wishlistitem", error);
      res.status(500).json({
        message: "Creating a WishlistItem failed!"
      });
    });
};

exports.getWishlistItems = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const wishlistQuery = Wishlist.find();
  let fetchedWishlistItems;
  if (pageSize && currentPage) {
    wishlistQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  wishlistQuery
    .then(documents => {
      fetchedWishlistItems = documents;
      return Wishlist.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Wishlist Items fetched successfully!",
        wishlistItems: fetchedWishlistItems,
        maxWishlistItems: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching Wishlist Items failed!"
      });
    });
};

exports.getWishlistProductsId = (req, res, next) => {
  const wishlistQuery = Wishlist.find();
  let fetchedWishlistProductsId;
  wishlistQuery
    .then(documents => {
      fetchedWishlistProductsId = documents.map((document)=>document.productId);
      return Wishlist.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Wishlist Items fetched successfully!",
        wishlistProductsId: fetchedWishlistProductsId,
        maxWishlistProductsId: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching Wishlist Items failed!"
      });
    });
};

exports.deleteWishlistItem = (req, res, next) => {
  Wishlist.deleteOne({ productId: req.params.id })
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
        message: "Deleting Wishlist Item failed!"
      });
    });
};
