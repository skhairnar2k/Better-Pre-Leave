"use strict";
const { ResponseModel } = require("../models/responseObj.js");
const { query, insert } = require("../repo/dbRepo.js");
const { sendOtpEmailVerify } = require("../repo/emailRepo");

function generateOTP() {
  // Generate a random 5-digit number between 10000 and 99999
  const otp = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  return otp.toString();
}


const studentEmailVerification = async (reqBody) => {
  try {
    let check = await query(
      `SELECT * FROM students_master WHERE email='${reqBody.email}'`
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

const hodAddNewStudent = async (reqBody) => {
  try {

    const check = await query(
      `SELECT * FROM students_master WHERE username='${reqBody.username}'`
    );

    if (check.response.length > 0)
      return new ResponseModel(false, "ALREADY USERNAME EXIST", {});


    let insertData = {
      first_name: reqBody.first_name,
      last_name: reqBody.last_name,
      gender: reqBody.gender,
      username: reqBody.username,
      password: reqBody.password,
      email: reqBody.email,
    }

    let result = await insert('students_master', insertData);
    if (!result.status)
      return new ResponseModel(false, "FAILED TO ADD", {});

    let mapData = {
      department_id: reqBody.department_id,
      student_id: result.response.insertId,
    }

    let result2 = await insert('students_map_department', mapData)

    if (result2.status)
      return new ResponseModel(true, "STUDENT ADDED", {});
    else
      return new ResponseModel(false, "FAILED TO MAP", {});

  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const listAllStudentOfDepartment = async (reqBody) => {
  try {
    const result = await query(`SELECT students_master.id, students_master.first_name, students_master.last_name , department_master.department_name , students_master.username, students_master.password
      FROM students_master
      JOIN students_map_department ON students_master.id = students_map_department.student_id
      JOIN department_master ON department_master.id=students_map_department.department_id
      WHERE students_map_department.department_id =${reqBody.department_id} ORDER BY students_master.id DESC;`);

    return new ResponseModel(true, "FTECHED", { list: result.response });
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

module.exports = {
  hodAddNewStudent,
  listAllStudentOfDepartment,
  studentEmailVerification
};
