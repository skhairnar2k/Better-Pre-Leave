"use strict";
const { ResponseModel } = require("../models/responseObj.js");
const { query, insert } = require("../repo/dbRepo.js");



const newSosAlert = async (reqBody) => {
  try {

    let result = await insert('sos_master', reqBody);
    if (result.status) return new ResponseModel(true, 'ADDED', {}); else return new ResponseModel(false, 'FAILED SOS ADD', {});

  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};


const listSosAlert = async (reqBody) => {
  try {

    let result = await query(`SELECT id, sos_text,
    CONCAT(DATE_FORMAT(start_date, '%a %e %M, %Y'), ' to ', DATE_FORMAT(end_date, '%a %e %M, %Y')) AS duration
    FROM sos_master
    WHERE is_delete = 0 ORDER BY id DESC;`);
    if (result.status) return new ResponseModel(true, 'ADDED', { list: result.response }); else return new ResponseModel(false, 'FAILED SOS ADD', {});

  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};


module.exports = {
  newSosAlert, listSosAlert
};
