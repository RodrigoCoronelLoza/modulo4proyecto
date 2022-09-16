const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/authController");
const userRouter = express.Router();
//routes
userRouter
  .route("/")
  .all(authController.protect)
  //.get(productController.getAllProducts)
  .post(userController.addUser)
  .get(userController.getAllUsers);
userRouter
  .route("/:id")
  .all(authController.protect)
  .get(userController.getUserById)
  .delete(userController.deleteUserById)
  .put(userController.replaceUserById);
//productRouter.route("/:id").get(productController.getProductById);

module.exports = userRouter;
