"use strict";

const _SECONDS = 5000;

const { default: mongoose } = require("mongoose");
const process = require("process");
const os = require("os");

const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connections: ${numConnection}`);
};

const checkOverLoad = () => {
  // Moniter after every 5 seconds
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCore = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // Maximum number connection based on number of cores
    const maxConnection = numCore * 5;
    console.log(`Active connetion: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnection) {
      console.log("Overload detected!");
    }
  }, _SECONDS);
};

module.exports = {
  countConnect,
  checkOverLoad,
};
