"use strict";
const { ResponseModel } = require("../models/responseObj.js");
const { query, insert, updateQuery } = require("../repo/dbRepo.js");

const getStudentList = async (reqBody) => {
  try {
    var sqlText = ``;

    if (parseInt(reqBody.department_id) == 0) {
      sqlText = `SELECT * , sm.id as student_id 
        FROM students_master sm
        INNER JOIN students_map_department map ON map.student_id=sm.id
        INNER JOIN department_master dm ON dm.id=map.department_id
        WHERE sm.is_delete=0`;
    } else {
      sqlText = `SELECT * 
        FROM students_master sm
        INNER JOIN students_map_department map ON map.student_id=sm.id
        INNER JOIN department_master dm ON dm.id=map.department_id
        WHERE sm.is_delete=0 AND map.department_id=${reqBody.department_id}`;
    }

    const result = await query(sqlText);

    return new ResponseModel(true, "FETCHED", { list: result.response });
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const deactivateStudent = async (reqBody) => {
  try {
    await updateQuery(
      "students_master",
      { is_delete: 1 },
      { id: reqBody.student_id }
    );

    return new ResponseModel(true, "DEACTIVATE STUDNET", {});
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const getFacultyList = async (reqBody) => {
  try {
    var sqlText = ``;

    if (parseInt(reqBody.department_id) == 0) {
      sqlText = `SELECT * , sm.id as faculty_id , IF((SELECT COUNT(h.faculty_id) FROM faculty_map_hod h WHERE h.faculty_id=sm.id AND h.is_delete=0)>0,true,false) is_hod
          FROM faculty_master sm
          INNER JOIN faculty_map_department map ON map.faculty_id=sm.id
          INNER JOIN department_master dm ON dm.id=map.department_id
          WHERE sm.is_delete=0`;
    } else {
      sqlText = `SELECT * 
          FROM faculty_master sm
          INNER JOIN faculty_map_department map ON map.faculty_id=sm.id
          INNER JOIN department_master dm ON dm.id=map.department_id
          WHERE sm.is_delete=0 AND map.department_id=${reqBody.department_id}`;
    }

    const result = await query(sqlText);

    return new ResponseModel(true, "FETCHED", { list: result.response });
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const deactivateFaculty = async (reqBody) => {
  try {
    await updateQuery(
      "faculty_master",
      { is_delete: 1 },
      { id: reqBody.faculty_id }
    );

    return new ResponseModel(true, "DEACTIVATE FACULTY", {});
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

module.exports = {
  getStudentList,
  deactivateStudent,
  getFacultyList,
  deactivateFaculty,
};
