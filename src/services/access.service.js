"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const { getInfoData } = require("../utils");
const KeyTokenService = require("./keyToken.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "0001",
  EDITOR: "0002",
  ADMIN: "0000",
};

class AccessService {
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });

    if (!foundShop) throw new BadRequestError("Shop not registered");

    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Authentication Error");

    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
    });
    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      {
        userId,
        email,
      },
      publicKey,
      privateKey
    );

    const privateKeyString = privateKey.toString(),
      publicKeyString = publicKey.toString();

    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKeyString,
      publicKeyString,
      userId,
    });

    return {
      shop: getInfoData(["_id", "name", "email"], foundShop),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // try {
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      console.log(holderShop);
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
      const publicKeyString = publicKey.toString();

      const publicKeyToken = keyTokenService.createKeyToken({
        userId: newShop._id,
        publicKeyString,
      });

      if (!publicKeyToken) {
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
        shop: getInfoData(["_id", "name", "email"], newShop),
        tokens,
      };
    }
    return null;
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
