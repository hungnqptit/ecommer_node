"use strict";

const { CREATED } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    // try {
    console.log(`[P]::SignUp::`, req.body);
    new CREATED({
      message: "Register Success",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
    // return res.status(201).json(await AccessService.signUp(req.body));
    // } catch (e) {
    //   next(e);
    // }
  };
}

module.exports = new AccessController();
