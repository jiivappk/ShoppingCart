const Order = require("../models/order");


exports.createOrder = (req, res, next) => {
    console.log("Request for cartitem Controller is",req.body);
    const url = req.protocol + "://" + req.get("host");
    let fetchedOrderItems;
    console.log("url is ",url);
    const order = new Order({
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
      address: req.body.address,
      additionalImages: req.body.additionalImages,
      orderStatus: req.body.orderStatus,
      refundStatus: req.body.refundStatus
    });
    order
      .save()
      .then((documents)=>{
        fetchedOrderItems = documents;
        console.log("FetchedOrderItems",fetchedOrderItems)
        return Order.count();
      })
      .then(count => {
        res.status(201).json({
          message: "Order Placed successfully",
          orderItem: fetchedOrderItems,
          orderItem: {
            orderId:fetchedOrderItems._id,
            price: fetchedOrderItems.price,
            actualPrice: fetchedOrderItems.actualPrice,
            noOfStocks: fetchedOrderItems.noOfStocks,
            discountPercentage: fetchedOrderItems.discountPercentage,
            address: fetchedOrderItems.address,
            additionalImages: fetchedOrderItems.additionalImages,
            orderStatus: fetchedOrderItems.orderStatus,
            refundStatus: fetchedOrderItems.refundStatus,
            content:fetchedOrderItems.content,
            creator:fetchedOrderItems.creator,
            imagePath:fetchedOrderItems.imagePath,
            productId:fetchedOrderItems.productId,
            title:fetchedOrderItems.title,
            userId:fetchedOrderItems.userId,
          },
          maxOrderItems: count
        });
      })
      .catch(error => {
        console.log("Error occured while saving  to Order", error);
        res.status(500).json({
          message: "Placing Order failed!"
        });
      });
  };

  exports.getOrderItems = (req, res, next) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const orderQuery = Order.find();
    let fetchedOrderItems = [];
    if (pageSize && currentPage) {
      orderQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    orderQuery
      .then(documents => {
        // fetchedOrderItems = documents;
        documents.map((document)=>{
         fetchedOrderItems.push({
          orderId:document._id,
          address: document.address,
          price: document.price,
          actualPrice: document.actualPrice,
          noOfStocks: document.noOfStocks,
          discountPercentage: document.discountPercentage,
          additionalImages: document.additionalImages,
          orderStatus: document.orderStatus,
          content:document.content,
          creator:document.creator,
          imagePath:document.imagePath,
          productId:document.productId,
          refundStatus:document.refundStatus,
          title:document.title,
          userId:document.userId,
         })
        });
        console.log("Orders documents from getOrderItems",fetchedOrderItems)
        return Order.count();
      })
      .then(count => {
        res.status(200).json({
          message: "Order Items fetched successfully!",
          orderItems: fetchedOrderItems,
          maxOrderItems: count
        });
      })
      .catch(error => {
        res.status(500).json({
          message: "Fetching Order Items failed!"
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
  