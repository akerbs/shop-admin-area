"use strict";
const fs = require("fs");
const request = require("request");
const csvdb = require("./db/csvdb.js");

const HOST = "127.0.0.1";
const PORT = 8081;
const BASE_URL = `http://${HOST}:${PORT}`;

const assert = (a, b) => {
    if (a !== b) {
        console.log(`test failed: "${a}"`);
        process.exit(1);
    }
};

const doGetRequest = (path) => {
    const tryFetch = (resolve, reject) => { 
        request.get(BASE_URL + path, (err, res, data) => {
            if (err) { reject(err); }
            else { resolve(JSON.parse(data)); }
        });
    };
    return new Promise(tryFetch);
};

const doPostRequest = (path, input) => {
    const tryFetch = (resolve, reject) => {
        request.post(BASE_URL + path, { json: input }, (err) => {
            if (err) { reject(err); }
            else { resolve(); }
        });
    };
    return new Promise(tryFetch);
};

const doDeleteRequest = (path) => {
    const tryFetch = (resolve, reject) => {
        request.delete(BASE_URL + path, (err) => {
            if (err) { reject(err); }
            else { resolve(); }
        });
    };
    return new Promise(tryFetch);
};

const doPutRequest = (path, input) => {
    const tryFetch = (resolve, reject) => {
        request.put(BASE_URL + path, { json: input }, (err) => {
            if (err) { reject(err); }
            else { resolve(); }
        });
    };
    return new Promise(tryFetch);
};

doGetRequest("/products")
.then( res => {
    assert(8, res.length);
    return doPostRequest("/product", { "code":"TEST0815","shortdesc":"test product","tagline":"yo","quantity":"10","price":"9.90"} );
})
.then( res => {
    return doPostRequest("/product", { "code":"TEST0816","shortdesc":"another test","tagline":"yo","quantity":"1","price":"9.90"} );
})
.then( res => {
    return doGetRequest("/product");
})
.then( res => {
    assert(10, res.length);
    return doGetRequest("/product/TEST0815");
})
.then( res => {
    assert(false, res.stockwarn);
    return doGetRequest("/product/TEST0816");
})
.then( res => {
    assert(true, res.stockwarn);
    return doGetRequest("/product/TEST0816");
})
.then( res => {
    return doDeleteRequest("/product/TEST0815");
})
.then( res => {
    return doPutRequest("/product", {"code":"TEST0816","shortdesc":"another test","tagline":"yo","quantity":"1","price":"19.90"});
})
.then( res => {
    return doGetRequest("/product/TEST0816");
})
.then( res => {
    assert("19.90", res.price);
    return doDeleteRequest("/product/TEST0816");
})
.then( res => {
    return doGetRequest("/product");
})
.then ( res => {
    assert(8, res.length);
    console.log("all tests passed");
})
.catch( err => console.log("Error: " + err));
