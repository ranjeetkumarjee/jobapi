const express = require("express");
const app = express();
const routerPath = require("./router");
const dotenv = require("dotenv");
dotenv.config();
const db = require("./config/mongo.init");
const port = 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", routerPath);
// app.get("/*", (req, res) => {
//   return res.send("Hello server is running");
// });

app.listen(port, (error) => {
  if (error) {
    console.error("Error", error);
  }
  console.log(`Server is running on port ${port}`);
});
