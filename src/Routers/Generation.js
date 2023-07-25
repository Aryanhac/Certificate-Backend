const express = require("express");
const generator = express.Router();
const {
  generateData,
  uploadCertificate,
  uploadCertificate2,
} = require("../Controllers/GenerationController");
const { isAuthentication } = require("../../middleware/authentication");

generator.post("/v1/uploadExcel", isAuthentication, generateData);
generator.post("/v1/uploadCertificates", isAuthentication, uploadCertificate);
generator.post("/v1/uploadCertificates2", isAuthentication, uploadCertificate2);

module.exports = generator;
