const Product = require("../models/product");

exports.createProduct = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  console.log("Create product is called",url)
  const product = new Product({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
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
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const title = req.query.title;
  console.log("Product controller getproducts is called!!!!!!!!!!!!!!!!!!")
  console.log("Title",title);
  console.log("PageSize",pageSize);
  console.log("currentPage",currentPage);
  
  if(title!=undefined){
    productQuery = Product.find({title: { $regex: new RegExp(title) } })
    
    if (pageSize && currentPage) {
      productQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    productQuery
      .then(documents => {
        fetchedProducts = documents;
        return Product.aggregate([{$match: {title: {$regex: new RegExp(title)}}}, { $count: "count"}])
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
