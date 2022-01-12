const Order = require("../models/order");

exports.createOrder = (req, res, next) => {
    console.log("Request for cartitem Controller is",req);
    const url = req.protocol + "://" + req.get("host");
    let fetchedOrderItems;
    console.log("url is ",url);
    const Order = new Order({
      title: req.body.title,
      content: req.body.content,
      imagePath: req.body.imagePath,
      postId: req.body.postId,
      creator: req.body.creator,
      userId: req.body.userId,
      orderStatus: req.userData.orderStatus
    });
    Order
      .save()
      .then((documents)=>{
        this.fetchedOrderItems = documents;
        console.log("FetchedOrderItems",this.fetchedOrderItems)
        return Order.count();
      })
      .then(count => {
        
        res.status(201).json({
          message: "Order Placed successfully",
          orderItem: this.fetchedOrderItems,
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