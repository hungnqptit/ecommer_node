"use strict";

const { Types } = require("mongoose");
const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      //lv 0
      // const publicKeyString = publicKey.toString();
      // const token = await keytokenModel.create({
      //   user: userId,
      //   publicKey: publicKeyString,
      // });`
      // return token ? publicKeyString : null;
      // level xxx

      const filter = { user: userId },
        update = {
          publicKey,
          privateKey,
          refreshToken,
          refreshTokenUsed: [],
        },
        options = { upsert: true, new: true };
      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return tokens ? tokens.publicKey : null;
    } catch (e) {
      return e;
    }
  };

  static findByUserId = async (userId) => {
    return await keytokenModel
      .findOne({ user: new Types.ObjectId(userId) })
      .lean();
  };

  static removeByUserId = async (userId) => {
    return await keytokenModel
      .deleteOne({ user: new Types.ObjectId(userId) })
      .lean();
  };
}

module.exports = KeyTokenService;
