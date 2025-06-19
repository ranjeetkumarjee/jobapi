const mongoose = require("mongoose");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.Mongo_URL);
}

const db = mongoose.connection;

db.on("error", console.error.bind(console, "error in connnection DB"));

db.once("open", function () {
  console.log("successfully connected to database");
});

module.exports = db;
