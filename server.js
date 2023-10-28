const app = require("./src/app");

const PORT = 3052;

const server = app.listen(PORT, () => {
  console.log(`start with ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log("Exit server");
    process.exit(0);
  });
});
