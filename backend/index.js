const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
var db = require("diskdb");
db = db.connect("./db", ["inventory"]);

require("./getData");

app.use(cors());
app.use(bodyParser.json());

app.get("/inv", (req, res) => {
  const inventory = db.inventory.find();
  res.json(inventory);
});
app.listen(8000, console.log("server running on 8000"));
