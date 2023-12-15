"use strict";
const Cryptr = require("cryptr");
const Bcrypt = require("bcryptjs");
const { ResponseModel } = require("../models/responseObj");

const logger = (TAG, msg) => {
  console.log(`${TAG}: ${msg}`);
};

const getEncrypt = (value) => {
  const cryptr = new Cryptr(process.env.CRYPTR_KEY); //Server Secret Key
  return cryptr.encrypt(value);
};

const getDecrypt = (value) => {
  console.log("new decrypt: ", value);
  const cryptr = new Cryptr(process.env.CRYPTR_KEY); //Server Secret Key
  return cryptr.decrypt(value);
};

const getHashPassword = (value) => {
  return Bcrypt.hashSync(value, 8); //8=saltRounds
};

const isCompared = (value, testValue) => {
  return Bcrypt.compareSync(testValue, value); //8=saltRounds and returns true or false
};

const checkReq = (req, requiredParams) => {
  for (const param of requiredParams) {
    if (!req.body[param]) {
      return {
        success: false,
        message: `Missing parameter: ${param}`,
        data: {},
      };
    }
  }

  return null;
};
module.exports = {
  logger,
  isCompared,
  getDecrypt,
  getEncrypt,
  getHashPassword,
  checkReq,
};
