"use strict";
const fs = require("fs");
const csvdb = require("./db/csvdb.js");

// Behauptung a === b
const assert = (a, b) => {
    if (a !== b) {
        console.log(`test failed: "${a}"`);
        // Node- Anwendung wird beendet.
        process.exit(1);
    }
};

csvdb.loadProductsFromFile();

assert(8,       csvdb.getProductCodes().length);

csvdb.insertProduct(
    {"code":"TEST0815","shortDescription":"test product","tagline":"yo","quantity":"10","price":"9.90"}
);
csvdb.insertProduct(
    {"code":"TEST0816","shortDescription":"another test","tagline":"yo","quantity":"1","price":"9.90"}
);

assert(10,      csvdb.getProductCodes().length);
assert(false,   csvdb.getProductByCode("TEST0815").stockwarn);
assert(true,    csvdb.getProductByCode("TEST0816").stockwarn);

csvdb.deleteProduct("TEST0815");
csvdb.updateProduct({"code":"TEST0816","shortDescription":"another test","tagline":"yo","quantity":"1","price":"19.90"});

assert("19.90",    csvdb.getProductByCode("TEST0816").price);

csvdb.deleteProduct("TEST0816");

assert(8,       csvdb.getProductCodes().length);

csvdb.saveProductsToFile();

console.log("all tests passed");
