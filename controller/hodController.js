"use strict";
const { ResponseModel } = require("../models/responseObj.js");
const { query, insert } = require("../repo/dbRepo.js");

const addNewHod = async (reqBody) => {
  try {

    let checkFaculty = await query(`SELECT department_id FROM faculty_map_department map WHERE map.faculty_id=${reqBody.faculty_id};`)

    if (checkFaculty.response == 0) {
      return new ResponseModel(false, "NO FACULTY FOUND", {})
    }
    else if (checkFaculty.response[0].department_id == reqBody.department_id) {
      await query(`UPDATE faculty_map_hod SET is_delete=1 WHERE department_id=${reqBody.department_id}`)

      let mapData = {
        faculty_id: reqBody.faculty_id,
        department_id: reqBody.department_id
      }

      let result = await insert('faculty_map_hod', mapData);
      if (result.status) {
        return new ResponseModel(true, 'NEW HOD ASSIGNED', {});
      }
      else {
        return new ResponseModel(false, 'FAILED HOD ASSIGNED', {});
      }

    }
    else {
      return new ResponseModel(false, 'FACULTY NOT BELONGS TO SAME DEPARTMENT', {});
    }


  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const listHod = async (reqBody) => {
  try {
    const result = await query(
      `SELECT faculty_master.id, faculty_master.first_name, faculty_master.last_name,faculty_master.username,faculty_master.password, department_master.department_name
      FROM faculty_master
      INNER JOIN faculty_map_hod ON faculty_master.id = faculty_map_hod.faculty_id
      JOIN department_master ON faculty_map_hod.department_id = department_master.id WHERE faculty_map_hod.is_delete=0;`
    );

    return new ResponseModel(true, "FTECHED", { list: result.response });
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

module.exports = {
  addNewHod,
  listHod,
};
