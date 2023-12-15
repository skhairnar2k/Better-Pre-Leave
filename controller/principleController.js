"use strict";
const { ResponseModel } = require("../models/responseObj.js");
const { query, insert } = require("../repo/dbRepo.js");

const principleDashbpoard = async (reqBody) => {
  try {
    var allowanceLeaveFaculty = await query(`SELECT * FROM leave_allowance WHERE role_type='faculty'`)
    allowanceLeaveFaculty = allowanceLeaveFaculty.response[0].allowance;
    var allowanceLeaveStudent = await query(`SELECT * FROM leave_allowance WHERE role_type='student'`)
    allowanceLeaveStudent = allowanceLeaveStudent.response[0].allowance;

    var onHolidayFaculty = await query(`SELECT CONCAT(fm.first_name , ' ' , fm.last_name) as name , lt.leave_type , 
    CONCAT(DATEDIFF(lf.end_date, lf.start_date), ' Days (', DATE_FORMAT(lf.start_date, '%M %d, %Y'), ' to ', DATE_FORMAT(lf.end_date, '%M %d, %Y'), ')') AS leaving_period,
    lf.status_change_by_type as approve_by
    FROM leave_faculty lf 
    INNER JOIN faculty_master fm ON fm.id=lf.faculty_id
    INNER JOIN leave_type lt ON lt.id=lf.leave_type_id
    INNER JOIN leave_status_master ls ON ls.id=lf.status_id
    WHERE lf.start_date <= CURDATE() AND lf.end_date >= CURDATE() AND lf.status_id = 3;`)

    var onHolidayStudent = await query(`SELECT CONCAT(fm.first_name , ' ' , fm.last_name) as name , lt.leave_type , 
    CONCAT(DATEDIFF(lf.end_date, lf.start_date), ' Days (', DATE_FORMAT(lf.start_date, '%M %d, %Y'), ' to ', DATE_FORMAT(lf.end_date, '%M %d, %Y'), ')') AS leaving_period,
    lf.status_change_by_type as approve_by
    FROM leave_student lf 
    INNER JOIN students_master fm ON fm.id=lf.student_id
    INNER JOIN leave_type lt ON lt.id=lf.leave_type_id
    INNER JOIN leave_status_master ls ON ls.id=lf.status_id
    WHERE lf.start_date <= CURDATE() AND lf.end_date >= CURDATE() AND lf.status_id = 3;`)

    return new ResponseModel(true, "FETCHED", {
      faculty_allowance: allowanceLeaveFaculty,
      student_allowance: allowanceLeaveStudent,
      on_holiday_faculty: onHolidayFaculty.response,
      on_holiday_student: onHolidayStudent.response,
    })

  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

module.exports = {
  principleDashbpoard
};
