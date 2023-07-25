const express = require("express");
const verify = express.Router();
const { verification , download } = require("../Controllers/VerificationController");
verify.post("/v1/verify", verification);
verify.post("/v1/download", download);


module.exports = verify;
