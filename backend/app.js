const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const productsRoutes = require("./routes/products");
const orderRoutes = require("./routes/orders")
const cartRoutes = require("./routes/cart");
const userRoutes = require("./routes/user");
var cors = require('cors')

const app = express();

// mongoose
//   .connect(
//     "mongodb+srv://max:" +
//       process.env.MONGO_ATLAS_PW +
//       "@cluster0-ntrwp.mongodb.net/node-angular",
//       { useNewUrlParser: true }
//   )
mongoose
  .connect("mongodb://127.0.0.1/node-angular",{ useNewUrlParser: true }, { useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

  const corsOpts = {
    origin: '*',
  
    methods: [
      'GET',
      'Product',
      'PATCH',
      'PUT',
      'DELETE',
      'OPTIONS'
    ],
  
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization'
    ],
  };

app.use(cors(corsOpts));
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.removeHeader('x-powered-by');
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, Product, PATCH, PUT, DELETE, OPTIONS"
//   );
//   next();
// });
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use("/api/products", productsRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
