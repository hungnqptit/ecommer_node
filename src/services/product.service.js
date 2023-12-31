"use strict";

const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronic } = require("../models/product.model");

class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "Electronics":
        return new Electronic(payload).createProduct();
      case "Clothing":
        return new Clothing(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid Product types ${type}`);
    }
  }
}
// {
//     product_name: {
//       type: String,
//       required: true,
//     },
//     product_thumb: {
//       type: String,
//       required: true,
//     },
//     product_description: String,
//     product_quantity: {
//       type: Number,
//       required: true,
//     },
//     product_type: {
//       type: String,
//       required: true,
//     },
//     product_shop: {
//       type: Types.ObjectId,
//       ref: "Shop",
//     },
//     product_attributes: { type: Schema.Types.Mixed, required: true },
class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    (this.product_name = product_name),
      (this.product_thumb = product_thumb),
      (this.product_description = product_description),
      (this.product_quantity = product_quantity),
      (this.product_type = product_type),
      (this.product_shop = product_shop),
      (this.product_attributes = product_attributes);
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}

class Clothing extends Product {
  createProduct = async () => {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing) throw BadRequestError("Create new clothing error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw BadRequestError("Create new product error");

    return newProduct;
  };
}

class Electronic extends Product {
  createProduct = async () => {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic) throw BadRequestError("Create new clothing error");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw BadRequestError("Create new product error");

    return newProduct;
  };
}

module.exports = ProductFactory;
