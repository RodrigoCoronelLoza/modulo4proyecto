const express = require("express");
const shoppingCartController = require("./../controllers/shoppingCartController");
const authController = require("./../controllers/authController");
const shoppingCartRouter = express.Router();
//routes
shoppingCartRouter
  .route("/product/")
  .all(authController.protect)
  .get(shoppingCartController.getAllCarts)
  .post(shoppingCartController.addNewCartOrAddProduct);

shoppingCartRouter
  .route("/product/:id")
  .all(authController.protect)
  .delete(shoppingCartController.deleteOneProductOfCart);

shoppingCartRouter
  .route("/product/mine/:id")
  .all(authController.protect)
  .delete(shoppingCartController.deleteCartById);

shoppingCartRouter
  .route("/pay")
  .all(authController.protect)
  .post(shoppingCartController.payCart);

module.exports = shoppingCartRouter;
