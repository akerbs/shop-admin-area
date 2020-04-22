const csvdb = require("./db/csvdb");
const express = require("express");
const fs = require("fs");
const marked = require("marked");
const bodyParser = require("body-parser");

const app = express();

// const HOST = "127.0.0.1";
// const PORT = 8081;
const PORT = process.env.PORT || 3000;

// serve static files from public/
app.use(express.static("public"));
app.use(bodyParser.json());

// Lade Daten
csvdb.loadProductsFromFile();

console.log(csvdb.saveProductsToFile());

// ROUTING
app.post("/product", (req, res) => {
  if (!csvdb.insertProduct(req.body)) {
    res.status(500).send("Error: Something went wrong");
  }
  csvdb.saveProductsToFile();
  res.status(200).send("");
});

app.get("/product", (req, res) => {
  const productCodes = csvdb.getProductCodes();
  res.status(200).send(productCodes);
});

app.get("/products/", (req, res) => {
  const products = csvdb.getProducts();
  res.send(products);
});

app.get("/product/:code", (req, res) => {
  // console.log(req.params);
  const code = req.params.code;
  const product = csvdb.getProductByCode(code);

  if (!product) {
    res.status(404).send({});
  }

  res.send(product);
});

app.put("/product", (req, res) => {
  if (!csvdb.updateProduct(req.body)) {
    res.status(500).send("Error: Something went wrong");
  }
  csvdb.saveProductsToFile();
  res.send("");
});

app.delete("/product/:code", (req, res) => {
  if (!csvdb.deleteProduct(req.params.code)) {
    res.status(500).send("Error: Something went wrong");
  }
  csvdb.saveProductsToFile();
  res.send("");
});

app.get("/readme", (req, res) => {
  const header = fs.readFileSync("public/partials/header.ejs", "utf8");
  const md = fs.readFileSync("public/readme.md", "utf8");
  const footer = fs.readFileSync("public/partials/footer.ejs", "utf8");

  const html = header + marked(md.toString()) + footer;

  res.send(html);
});

// Start Server
app.listen(PORT, () => {
  // console.log(`listen to http://${HOST}:${PORT}/`);
  console.log(`Server has been started...`);
});
