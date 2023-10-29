"use strict";
const { default: mongoose, mongo } = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const {
  db: { host, port, name },
} = require("../configs/config.mongodb");
// connect string
const connectString = `mongodb://${host}:${port}/${name}`;
class Database {
  constructor() {
    this.connect();
  }

  //connect function
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString)
      .then((_) => {
        console.log("Connect db success...");

        countConnect();
      })
      .catch((err) => console.log(`Connect error ${err}`));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instanceMongoDb = Database.getInstance();

module.exports = instanceMongoDb;
