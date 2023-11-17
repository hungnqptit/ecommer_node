"use strict";

const JWT = require("jsonwebtoken");
const { asyncHandler } = require("./checkAuth");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    //accessToken
    const accessToken = await JWT.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "2 days",
    });
    //refreshToken
    const refreshToken = await JWT.sign(payload, privateKey, {
      // algorithm: "RS256",
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, privateKey, (err, decode) => {
      if (err) {
        console.log("err verify :: ", err);
      } else {
        console.log("decode verify :: ", decode);
      }
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
  Check userId missing
  Get access Token
  Verify token
  check user db
  check keystore with this userId
  return next() 
  */

  //1
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  //2
  const keyStore = await findByUserId(userId);
  console.log(keyStore);
  if (!keyStore) throw new NotFoundError("Not found Key Store");

  //3
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.privateKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid UserId");
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};

module.exports = { createTokenPair, authentication, verifyJWT };
