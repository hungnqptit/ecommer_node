"use strict";

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

      try {
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
      } catch (e) {
        console.log(e);
      }

      return tokens ? tokens.publicKey : null;
    } catch (e) {
      return e;
    }
  };
}

module.exports = KeyTokenService;
