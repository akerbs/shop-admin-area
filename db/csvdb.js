const fs = require("fs");

let products = [];
let header = [];

const FILE_NAME = "data/products.csv";
const NOT_FOUND = -1;
const STOCK_WARN_LEVEL = 5;

const loadProductsFromFile = (filename = FILE_NAME, encoding = "utf8") => {
  const recordToObject = (record) => {
    const fields = record.split(/\s*,\s*/);
    return {
      code: fields[0],
      shortDescription: fields[1],
      tagline: fields[2],
      quantity: fields[3],
      price: fields[4],
      stockwarn: fields[3] <= 5,
    };
  };

  const rows = fs.readFileSync(filename, encoding).split("\n");

  header = rows.shift().split(/\s*,\s*/); // remove header from array

  products = rows.filter((row) => row !== "").map((row) => recordToObject(row));
  /*
  [
    {
      code: SKO0507,
      shortDescription: Lorem ipsum dolor sit amet consectetur,
      tagline: adipisicing elit,
      quantity: 20,
      price: 49.90,
      stockwarn: true
    },
    …
    {…},
  ]
  */
};

const saveProductsToFile = (filename = FILE_NAME, encoding = "utf8") => {
  const content = `${header.join(",")}\n${products
    .map(
      (p) =>
        `${p.code},${p.shortDescription},${p.tagline},${p.quantity},${p.price}\n`
    )
    .join("")}`;

  fs.writeFileSync(filename, content, encoding);
};

const getIndexByCode = (code) => {
  return products.findIndex((product) => product.code === code);
};

const getProducts = () => products;

const getProductCodes = () => {
  return products.map((product) => product.code);
};

const getProductByCode = (code) =>
  products.find((product) => product.code === code);

const insertProduct = (product) => {
  const index = getIndexByCode(product.code);

  if (index !== NOT_FOUND) {
    console.warn("Warning: could not insert product. (Product already exists)");
    return false;
  }

  product.stockwarn = product.quantity <= STOCK_WARN_LEVEL;
  products.push(product);
  return true;
  // products.splice(products.length -1, 0, product);
};

const updateProduct = (product) => {
  const index = getIndexByCode(product.code);

  if (index === NOT_FOUND) {
    console.warn("Warning: product could not be updated (unknown)");
    return false;
  }

  product.stockwarn = product.quantity <= STOCK_WARN_LEVEL;
  products[index] = product;
  // products.splice(index, 1, product);
  return true;
};

const deleteProduct = (code) => {
  const index = getIndexByCode(code);

  if (index === NOT_FOUND) {
    console.warn("Warning: product could not be deleted (unknown)");
    return false;
  }

  products.splice(index, 1);
  return true;
};

module.exports = {
  loadProductsFromFile,
  getProductCodes,
  getProductByCode,
  getProducts,
  saveProductsToFile,
  insertProduct,
  updateProduct,
  deleteProduct,
};
