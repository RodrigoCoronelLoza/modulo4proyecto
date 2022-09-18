const fs = require("fs");
const ShoppingCart = require("../models/ShoppingCart");
const Product = require("../models/Product");
const MyError = require("../utils/MyError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.addNewCartOrAddProduct = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new MyError("You are not logged in! Please log in to get access.", 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const foundProduct = await Product.findById(req.body.productId);

  if (!foundProduct) {
    return next(new MyError("The product in the req does not exist.", 404));
  }

  const cartFound = await ShoppingCart.findOne({ status: "pending" });

  if (cartFound) {
    let arrayProducts = cartFound.products;

    arrayProducts.push({
      idProduct: req.body.productId,
      price: foundProduct.price,
      quantity: req.body.quantity,
    });

    cartFound.products = arrayProducts;
    const cartFound2 = await ShoppingCart.findByIdAndUpdate(cartFound.id, {
      products: arrayProducts,
    });

    res.status(200).json({
      status: "success ADDITION OF A ELEMENT",
      timeOfRequest: req.requestTime,
      data: {
        cartFound,
      },
    });
  } else {
    let cartArray = [
      {
        idProduct: req.body.productId,
        price: foundProduct.price,
        quantity: req.body.quantity,
      },
    ];

    let newShoppingCart = await ShoppingCart.create({
      userName: String(decoded.id),
      status: "pending",
      products: cartArray,
    });

    res.status(200).json({
      user: newShoppingCart.user,
      status: "success CREATION CARTS",
      timeOfRequest: req.requestTime,
    });
  }
});

exports.getAllCarts = catchAsync(async (req, res, next) => {
  const carts = await ShoppingCart.find();

  res.status(200).json({
    status: "success",
    timeOfRequest: req.requestTime,
    results: carts.length,
    data: {
      carts,
    },
  });
});

exports.deleteOneProductOfCart = catchAsync(async (req, res, next) => {
  const foundCart = await ShoppingCart.findById(req.params.id);

  if (foundCart) {
    if (foundCart.status === "pending") {
      let arrayProducts = foundCart.products;

      let foundElement = arrayProducts.find(
        (element) => element.idProduct === req.body.productId
      );
      if (foundElement) {
        const index = arrayProducts.indexOf(foundElement);
        arrayProducts.splice(index, 1);

        const cartFound2 = await ShoppingCart.findByIdAndUpdate(req.params.id, {
          products: arrayProducts,
        });

        res.status(200).json({
          status: " Success DELETE of one product",
        });
      } else {
        return next(new MyError("That product is not in that cart", 404));
      }
    } else {
      return next(new MyError("There is no a pendign cart", 404));
    }
  } else {
    return next(
      new MyError("The given adress does not macth with any cart", 404)
    );
  }
});

exports.payCart = catchAsync(async (req, res, next) => {
  const cartFound = await ShoppingCart.findOne({ status: "pending" });
  if (!cartFound) {
    return next(new MyError("There is no a pendign cart", 404));
  } else {
    let arrayProducts = cartFound.products;
    if (arrayProducts.length > 0) {
      const cartFound2 = await ShoppingCart.findByIdAndUpdate(cartFound.id, {
        status: "paid",
      });
    } else {
      return next(
        new MyError("There pending cart does not have any product", 404)
      );
    }
  }

  res.status(200).json({
    status: " Payment method",
  });
});

exports.deleteCartById = catchAsync(async (req, res, next) => {
  const foundCart = await ShoppingCart.findByIdAndDelete(req.params.id);

  if (foundCart) {
    res.status(200).json({
      status: " delete CART success",
      data: {
        product: foundCart,
      },
    });
  } else {
    res.status(404).json({
      status: "not found",
    });
  }
});
