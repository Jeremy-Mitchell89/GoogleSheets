const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
var db = require("diskdb");
db = db.connect("./db", ["inventory"]);
var utils = require("./getData");
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  const inventory = db.inventory.find();
  res.json(inventory);
});

app.post("/destroy", async (req, res) => {
  utils.runScrap(req.body.row);
  db.inventory.remove({ serialNumber: req.body.serial });
});

app.listen(8000, console.log("server running on 8000"));
