"use strict";

import { mongoose } from "mongoose";

const connectString = "mongodb://localhost:27017/shopDEV";

mongoose
  .connect(connectString)
  .then((_) => console.log("Connect db success..."))
  .catch((err) => console.log(`Connect error ${err}`));

if (1 === 0) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose;
