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

app.post("/destroy", (req, res) => {
  utils.runScrap(req.body.row);
});

app.delete("/inventory/:id", async (req, res) => {
  db.inventory.remove({ _id: req.params.id });
  res.json({ status: "success" });
});

app.listen(8000, console.log("server running on 8000"));
