"use strict";
const { ResponseModel } = require("../models/responseObj.js");
const { query, insert } = require("../repo/dbRepo.js");

const addNewDepartment = async (reqBody) => {
  try {
    const check = await query(
      `SELECT * FROM department_master WHERE department_name='${reqBody.department_name}' OR code='${reqBody.department_code}'`
    );

    if (check.response.length > 0)
      return new ResponseModel(false, "ALREADY EXIST", {});
    else {
      let insertData = {
        department_name: reqBody.department_name,
        code: reqBody.department_code,
      };

      let result = await insert("department_master", insertData);

      if (result.status) return new ResponseModel(true, "ADDED DEPARTMENT", {});
      else return new ResponseModel(false, "FAILED TO ADD", {});
    }
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const listDepartment = async (reqBody) => {
  try {
    const result = await query(`SELECT dm.*, fm.first_name as hod_first_name, fm.last_name as hod_last_name
    FROM department_master dm
    LEFT JOIN faculty_map_hod fmh ON dm.id = fmh.department_id AND fmh.is_delete = 0
    LEFT JOIN faculty_master fm ON fmh.faculty_id = fm.id AND fm.is_delete = 0;`);

    return new ResponseModel(true, "FTECHED", { list: result.response });
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};



module.exports = {
  addNewDepartment,
  listDepartment,
};
