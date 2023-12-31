"use strict";

const { Schema, model, Types } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";

// Declare the Schema of the Mongo model
var productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_thumb: {
      type: String,
      required: true,
    },
    product_description: String,
    product_quantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
    },
    product_shop: {
      type: Types.ObjectId,
      ref: "Shop",
    },
    product_attributes: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true, collection: COLLECTION_NAME }
);

const clothingSchema = new Schema(
  {
    brand: { type: String, required: true },
    size: String,
    material: String,
    product_shop: {
      type: Types.ObjectId,
      ref: "Shop",
    },
  },
  { collection: "clothes", timestamps: true }
);

const electronicSchema = new Schema(
  {
    manufactor: { type: String, required: true },
    model: String,
    color: String,
    product_shop: {
      type: Types.ObjectId,
      ref: "Shop",
    },
  },
  { collection: "electronics", timestamps: true }
);
//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("clothes", clothingSchema),
  electronic: model("electronics", electronicSchema),
};
