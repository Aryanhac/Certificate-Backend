const http = require("http");
const app = require("./src/app");
const database = require("./config/database");
const cloudinary = require("cloudinary");


//uncaughtException Error
process.on("uncaughtException", (err) => {
  console.log(`Error:${err}`);
  console.log("uncaughtException Error so, shutdown the PROCESS");
  server.close(() => {
    process.exit();
  });
});

//Config
require("dotenv").config({ path: "config/config.env" });

// connecting to database
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is working on ${process.env.PORT}`);
});


// unhandledRejection Error
process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log("unhandledRejection Error so, shutdown the PROCESS");
  server.close(() => {
    process.exit();
  });
});
