"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { BadRequestError } = require("../core/error.response");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "0001",
  EDITOR: "0002",
  ADMIN: "0000",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    // try {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop already register!");
      // return {
      //   code: "xxxx",
      //   message: "Shop already register!",
      //   status: "error",
      // };
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: hashedPassword,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // create privateKey, publicKey
      const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 4096,
      });
      console.log({ privateKey, publicKey });

      const publicKeyString = keyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
      });

      if (!publicKeyString) {
        return {
          code: "xxxx",
          message: "Public key string error",
        };
      }

      const tokens = await createTokenPair(
        {
          userId: newShop._id,
          email,
        },
        publicKey,
        privateKey
      );
      console.log("Create token success::!", tokens);
      return {
        code: "201",
        metadata: {
          shop: newShop,
          tokens,
        },
      };
    }
    return {
      code: "200",
      message: "Create Failed",
      metadata: null,
    };
    // } catch (e) {
    //   return {
    //     code: "xxx",
    //     message: e.message,
    //     status: "error",
    //   };
    // }
  };
}

module.exports = AccessService;
