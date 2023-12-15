"use strict";
const { ResponseModel } = require("../models/responseObj.js");
const { query } = require("../repo/dbRepo.js");

const loginPrinciple = async (reqBody, session) => {
  try {
    const result = await query(
      `SELECT * FROM principle_master WHERE username = '${reqBody.username}' AND is_delete=0`
    );

    if (result.response.length > 0) {
      if (result.response[0].password == reqBody.password) {
        session.admin = {
          id: result.response[0].id,
          username: result.response[0].username,
          first_name: result.response[0].first_name,
          last_name: result.response[0].last_name,
          role: "principle",
        };

        return new ResponseModel(true, "LOG IN SUCCESS", {});
      } else {
        return new ResponseModel(false, "WRONG PASSWORD", {});
      }
    } else {
      return new ResponseModel(false, "NO USER FOUND", {});
    }
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const loginHod = async (reqBody, session) => {
  try {
    const result = await query(
      `SELECT fm.*
      FROM faculty_master fm
      INNER JOIN faculty_map_hod fmd
      ON fm.id = fmd.faculty_id
      WHERE fm.username = '${reqBody.username}'
      AND fmd.is_delete = 0;`
    );

    if (result.response.length > 0) {
      if (result.response[0].password == reqBody.password) {
        session.admin = {
          id: result.response[0].id,
          username: result.response[0].username,
          first_name: result.response[0].first_name,
          last_name: result.response[0].last_name,
          role: "hod",
        };

        return new ResponseModel(true, "LOG IN SUCCESS", {});
      } else {
        return new ResponseModel(false, "WRONG PASSWORD", {});
      }
    } else {
      return new ResponseModel(false, "NO USER FOUND", {});
    }
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const loginFaculty = async (reqBody, session) => {
  try {
    const result = await query(
      `SELECT fm.*
      FROM faculty_master fm 
      WHERE fm.username = '${reqBody.username}';`
    );

    if (result.response.length > 0) {
      if (result.response[0].password == reqBody.password) {
        session.admin = {
          id: result.response[0].id,
          username: result.response[0].username,
          first_name: result.response[0].first_name,
          last_name: result.response[0].last_name,
          role: "faculty",
        };

        return new ResponseModel(true, "LOG IN SUCCESS", {});
      } else {
        return new ResponseModel(false, "WRONG PASSWORD", {});
      }
    } else {
      return new ResponseModel(false, "NO USER FOUND", {});
    }
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const loginStudent = async (reqBody, session) => {
  try {
    const result = await query(
      `SELECT fm.*
      FROM students_master fm 
      WHERE fm.username = '${reqBody.username}';`
    );

    if (result.response.length > 0) {
      if (result.response[0].password == reqBody.password) {
        session.admin = {
          id: result.response[0].id,
          username: result.response[0].username,
          first_name: result.response[0].first_name,
          last_name: result.response[0].last_name,
          role: "student",
        };

        return new ResponseModel(true, "LOG IN SUCCESS", {});
      } else {
        return new ResponseModel(false, "WRONG PASSWORD", {});
      }
    } else {
      return new ResponseModel(false, "NO USER FOUND", {});
    }
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};


const loginSystemAdmin = async (reqBody, session) => {
  try {
    const result = await query(
      `SELECT fm.*
      FROM system_admin_master fm 
      WHERE fm.username = '${reqBody.username}';`
    );

    if (result.response.length > 0) {
      if (result.response[0].password == reqBody.password) {
        session.admin = {
          id: result.response[0].id,
          username: result.response[0].username,
          first_name: result.response[0].first_name,
          last_name: result.response[0].last_name,
          role: "systemadmin",
        };

        return new ResponseModel(true, "LOG IN SUCCESS", {});
      } else {
        return new ResponseModel(false, "WRONG PASSWORD", {});
      }
    } else {
      return new ResponseModel(false, "NO USER FOUND", {});
    }
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

module.exports = {
  loginPrinciple,
  loginHod,
  loginFaculty,
  loginStudent,
  loginSystemAdmin
};
