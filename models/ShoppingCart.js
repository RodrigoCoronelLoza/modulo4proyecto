const mongoose = require("mongoose");
const ShoppingCartSchema = new mongoose.Schema({
  userName: {
    type: String,
    unique: false,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  products: {
    type: Array,
    required: true,
  },
});

const ShoppingCart = mongoose.model("ShoppingCart", ShoppingCartSchema);
module.exports = ShoppingCart;
