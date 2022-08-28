const Product = require("../models/product");

exports.createProduct = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  console.log("Create product is called",url);
  const additionalImages = [];
  for(file of req.files.additionalImages){
    additionalImages.push(url + "/images/" +file['filename']);
  }
  const product = new Product({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    imagePath: url + "/images/" + req.files.image[0]['filename'],
    additionalImages: additionalImages,
    creator: req.userData.userId,
    price: req.body.price,
    actualPrice: req.body.actualPrice,
    noOfStocks: req.body.noOfStocks,
    discountPercentage: req.body.discountPercentage,
    deliveryPeriod: req.body.deliveryPeriod,
    deliveryCharge: req.body.deliveryCharge,
    replacementPeriod: req.body.replacementPeriod
  });
  product
    .save()
    .then(createdProduct => {
      res.status(201).json({
        message: "Product added successfully",
        product: {
          ...createdProduct,
          id: createdProduct._id
        }
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Creating a product failed!"
      });
    });
};

exports.updateProduct = (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const product = new Product({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Product.updateOne({ _id: req.params.id, creator: req.userData.userId }, product)
    .then(result => {
      if (result.n > 0) {
        res.status(200).json({ message: "Update successful!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Couldn't udpate product!"
      });
    });
};

exports.getProducts = (req, res, next) => {
  let fetchedProducts;
  let productQuery;
  let categoryName = '';
  let pageSize = '';
  let currentPage = '';
  if(req.query.categoryName){
   categoryName = req.query.categoryName
  }
  else{
    pageSize = +req.query.pagesize;
    currentPage = +req.query.page;
    title = req.query.title;
  }
  console.log("Product controller getproducts is called!!!!!!!!!!!!!!!!!!")
  console.log("Title",title);
  console.log("PageSize",pageSize);
  console.log("currentPage",currentPage);
  
  if(title!=undefined || categoryName!=undefined){
    if(categoryName){
      productQuery = Product.find({category: { $regex: new RegExp(categoryName) } })
    }
    else{
      productQuery = Product.find({title: { $regex: new RegExp(title) } })
      if (pageSize && currentPage) {
        productQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
      }
    }
    productQuery
      .then(documents => {
        fetchedProducts = documents;
        if(categoryName){
          return Product.aggregate([{$match: {category: {$regex: new RegExp(categoryName)}}}, { $count: "count"}])
        }
        else{
          return Product.aggregate([{$match: {title: {$regex: new RegExp(title)}}}, { $count: "count"}])
        }
      })
      .then(searchResult => {
        console.log("Search Cunt is ",searchResult)
        res.status(200).json({
          message: "Products fetched successfully!",
          products: fetchedProducts,
          maxProducts: searchResult[0].count
        });
      })
      .catch(error => {
        res.status(500).json({
          message: "Fetching products failed!"
        });
      });  
    
  }
  else{
    console.log("Inside Else Block")
    productQuery = Product.find();

    if (pageSize && currentPage) {
      productQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    productQuery
      .then(documents => {
        fetchedProducts = documents;
        return Product.count();
      })
      .then(count => {
        console.log("Count ", count);
        res.status(200).json({
          message: "Products fetched successfully!",
          products: fetchedProducts,
          maxProducts: count
        });
      })
      .catch(error => {
        res.status(500).json({
          message: "Fetching products failed!"
        });
      });  
  }
  };

exports.getProduct = (req, res, next) => {
  Product.findById(req.params.id)
    .then(product => {
      if (product) {
        res.status(200).json(product);
      } else {
        res.status(404).json({ message: "Product not found!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching product failed!"
      });
    });
};

exports.searchProduct = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  console.log("Product controller getproducts is called!!!!!!!!!!!!!!!!!!")
  const currentPage = +req.query.page;
  const title = req.query.title;
  console.log("Title of the search",title);
  console.log("PageSize",pageSize);
  console.log("CurrentPage",currentPage);
  const productQuery = Product.find({title: { $regex: /^Car/ } })
  if (pageSize && currentPage) {
    productQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  productQuery
    .then(documents => {
      fetchedProducts = documents;
      
      return productQuery.count();
    })
    .then(count => {
      res.status(200).json({
        message: "Products fetched successfully!",
        products: fetchedProducts,
        maxProducts: count
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching products failed!"
      });
    });
};

exports.deleteProduct = (req, res, next) => {
  Product.deleteOne({ _id: req.params.id, creator: req.userData.userId })
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
        message: "Deleting products failed!"
      });
    });
};

exports.categoryList = (req, res, next) => {
  Product.aggregate([
    {
      $group :
      {
        _id : "$category",
        lowestPriceProduct:
        {
          $accumulator:
          {
            init: function() {                        
              return { price: -1, imagePath: "" }
            },
    
            accumulate: function(state, price, imagePath) { 
            if(state.price < 0){
              return {
                price: price,
                imagePath: imagePath
              }
            }
            else {
               return {
                price: state.price > price? price : state.price,
                imagePath: state.price > price? imagePath : state.imagePath,
              }
            }
            },
    
            accumulateArgs: ["$price", "$imagePath"],              
    
            merge: function(state1, state2) {         
              return {                                
                price: state2.price,
                imagePath: state2.imagePath 
              }
            },
    
            finalize: function(state) {               
              return state       
            },
            lang: "js"
          }
        }
      }
    }
    ])
    .then(result => {
      if (result) {
        res.status(200).json({ 
          message: "Category Fetched successful!",
          categoryList: result
        });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching Category failed!"
      });
    });
};


