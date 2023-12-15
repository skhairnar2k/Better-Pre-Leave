"use strict";
const { ResponseModel } = require("../models/responseObj.js");
const { query, insert } = require("../repo/dbRepo.js");
const { sendOtpEmailVerify } = require("../repo/emailRepo");

function generateOTP() {
  // Generate a random 5-digit number between 10000 and 99999
  const otp = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  return otp.toString();
}


const facultyEmailVerification = async (reqBody) => {
  try {
    let check = await query(
      `SELECT * FROM faculty_master WHERE email='${reqBody.email}'`
    );

    if (check.response.length == 0) {
      const myOTP = generateOTP();

      try {
        const info = await sendOtpEmailVerify(reqBody.email, myOTP);
        return new ResponseModel(true, "OTP SENT TO EMAIL", { otp: myOTP });
      } catch (error) {
        return new ResponseModel(false, "FAILED TO SENT", {});
      }
    } else return new ResponseModel(false, "ALREADY EMAIL IN USE", {});
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const addNewFaculty = async (reqBody) => {
  try {
    const check = await query(
      `SELECT * FROM faculty_master WHERE username='${reqBody.username}'`
    );

    if (check.response.length > 0)
      return new ResponseModel(false, "ALREADY USERNAME EXIST", {});
    else {
      let insertData = {
        first_name: reqBody.first_name,
        last_name: reqBody.last_name,
        gender: reqBody.gender,
        joining_date: reqBody.joining_date,
        username: reqBody.username,
        password: reqBody.password,
        email: reqBody.email,
      };

      let result = await insert("faculty_master", insertData);
      if (result.status) {
        let mapData = {
          faculty_id: result.response.insertId,
          department_id: reqBody.department_id,
        };

        let mapResult = await insert("faculty_map_department", mapData);
        if (mapResult.status) return new ResponseModel(true, "FACULTY ADD", {});
        else return new ResponseModel(false, "FAILED TO MAP", {});
      } else return new ResponseModel(false, "FAILED TO ADD", {});
    }
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const listAllFacultyOfDepartment = async (reqBody) => {
  try {
    const result =
      await query(`SELECT faculty_master.id, faculty_master.first_name, faculty_master.last_name , d.department_name
    FROM faculty_master
    JOIN faculty_map_department ON faculty_master.id = faculty_map_department.faculty_id
    JOIN department_master d ON faculty_map_department.department_id = d.id
    WHERE faculty_map_department.department_id = ${reqBody.department_id};`);

    return new ResponseModel(true, "FTECHED", { list: result.response });
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const listAllFaculty_Filter = async (reqBody) => {
  try {
    let where = ``;
    if (reqBody.department_id != 0) {
      where = `WHERE d.id=${reqBody.department_id} AND f.is_delete = 0 `;
    }

    const result =
      await query(`SELECT DISTINCT f.id, f.username , f.password, f.first_name, f.last_name, d.department_name, dep.department_name AS hod_department_name
    FROM faculty_master f
    JOIN faculty_map_department fd ON f.id = fd.faculty_id
    JOIN department_master d ON fd.department_id = d.id
    LEFT JOIN faculty_map_hod fh ON f.id = fh.faculty_id AND fh.is_delete = 0
    LEFT JOIN department_master dep ON fh.department_id = dep.id
    ${where}
    ORDER BY f.id DESC;`);

    return new ResponseModel(true, "FTECHED", { list: result.response });
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

module.exports = {
  addNewFaculty,
  listAllFacultyOfDepartment,
  listAllFaculty_Filter,
  facultyEmailVerification,
};
