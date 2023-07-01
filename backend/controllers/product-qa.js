const ProductQA = require("../models/product-qa");
const mongoose = require("mongoose");
exports.addProductQA = (req, res, next)=>{
  const url = req.protocol + "://" + req.get("host");
  const images = [];
  if(req.files.images){
    for(file of req.files.images){
      images.push(url + "/images/" +file['filename']);
    }
  }
  ProductReview.findOne({ productId: req.body.productId,  userId: req.body.userId})
              .then(productResult => {
                  if(productResult != null){
                    const productReview = new ProductReview({
                      _id: productResult._doc._id,
                      productId: req.body.productId,
                      productTitle: req.body.productTitle,
                      userId: req.body.userId,
                      userName: req.body.userName,
                      profilePic: req.body.profilePic,
                      ratingScale: req.body.ratingScale,
                      comment: req.body.comment,
                      images: images
                    });
                     ProductReview.updateOne({ _id: productResult._doc._id }, productReview)
                        .then(result => {
                          if (result.n > 0) {
                            res.status(200).json({ message: "Update Product Review successful!" });
                          } else {
                            res.status(401).json({ message: "Not authorized!" });
                          }
                        })
                        .catch(error => {
                          res.status(500).json({
                            message: "Couldn't udpate product Review!"
                          });
                        });
                    }
                    else{
                      const productReview = new ProductReview({
                        productId: req.body.productId,
                        productTitle: req.body.productTitle,
                        userId: req.body.userId,
                        userName: req.body.userName,
                        profilePic: req.body.profilePic,
                        ratingScale: req.body.ratingScale,
                        comment: req.body.comment,
                        images: images
                      });
                      productReview
                        .save()
                        .then(createdProductReview => {
                          res.status(201).json({
                            message: "Product Review added successfully",
                            product: {
                              ...createdProductReview,
                              id: createdProductReview._id
                            }
                          });
                        })
                        .catch(error => {
                          res.status(500).json({
                            message: "Creating a product Review failed!"
                          });
                        });
                    }

              })
              .catch((err) => {
                  return res.status(400).json({
                    message: "User id cannot be checked for existance in Product Review."
                    });
              })
}

exports.getSingleProductQA = (req, res, next)=>{

  ProductReview.findOne({ productId: req.query.productId,  userId: req.query.userId})
              .then(productResult => {
                  if(productResult != null){
                      res.status(200).json({ 
                        message: "Fetched Product Review successful!" ,
                        productReview: {
                            id:productResult._doc._id,
                            comment:productResult._doc.comment,
                            images:productResult._doc.images,
                            productId:productResult._doc.productId,
                            productTitle:productResult._doc.productTitle,
                            profilePic:productResult._doc.profilePic,
                            ratingScale:productResult._doc.ratingScale,
                            userId:productResult._doc.userId,
                            userName:productResult._doc.userName,
                        },
                        status: 'SUCCESS'
                      });
                    }
                    else{
                      res.status(200).json({ 
                        message: "Product Review for this user does not exists" ,
                        status: 'FAILED',
                        productReview: '',
                      });
                    }
              })
              .catch((err) => {
                  return res.status(400).json({
                        message: "User id cannot be checked for existance in Product Review.",
                        status: 'FAILED',
                        productReview: '',
                    });
              })
}

exports.getProductQA = (req, res, next)=>{
    let fetchedProductReviews = [];
    let productReviewQuery;
    let productId;
    let pageSize = '';
    let currentPage = '';
    pageSize = +req.query.pagesize;
    currentPage = +req.query.page;
    productIdNo = req.query.productId;
  
    productReviewQuery = ProductReview.find({productId: productIdNo})
    if (pageSize && currentPage) {
      productReviewQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }

    productReviewQuery
      .then(documents => {
        documents.map((doc)=>{
          fetchedProductReviews.push(doc._doc);
        })
        return ProductReview.aggregate([{$match: {productId:  mongoose.Types.ObjectId(productIdNo)}}, { $count: "count"}]);
      })
      .then(totalReviewCount => {
        res.status(200).json({
          message: "Products fetched successfully!",
          productReviews: fetchedProductReviews,
          totalReviewCount: totalReviewCount[0].count
        });
      })
      .catch(error => {
        res.status(500).json({
          message: "Fetching products failed!"
        });
      });  
}

exports.updateProductReview = (req, res, next)=>{

}


