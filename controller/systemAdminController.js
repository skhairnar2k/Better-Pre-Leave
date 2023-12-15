"use strict";
const { ResponseModel } = require("../models/responseObj.js");
const { query, insert } = require("../repo/dbRepo.js");

const addNewSystemAdmin = async (reqBody) => {
  try {
    const check = await query(
      `SELECT * FROM system_admin_master WHERE username='${reqBody.username}' `
    );

    if (check.response.length > 0)
      return new ResponseModel(false, "ALREADY EXIST USERNAME", {});
    else {
      let insertData = {
        first_name: reqBody.first_name,
        last_name: reqBody.last_name,
        username: reqBody.username,
        password: reqBody.password,
      };

      let result = await insert("system_admin_master", insertData);

      if (result.status)
        return new ResponseModel(true, "ADDED NEW SYSTEM ADMIN", {});
      else return new ResponseModel(false, "FAILED TO ADD", {});
    }
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const listSystemAdmin = async (reqBody) => {
  try {
    const result = await query(`SELECT * FROM system_admin_master`);

    return new ResponseModel(true, "FTECHED", { list: result.response });
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

module.exports = {
  addNewSystemAdmin,
  listSystemAdmin,
};
