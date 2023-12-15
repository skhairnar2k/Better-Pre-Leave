"use strict";
const { ResponseModel } = require("../models/responseObj.js");
const { query, insert, updateQuery, insertMultiple } = require("../repo/dbRepo.js");
const { statusChangeLeave } = require("../repo/emailRepo.js");
const moment = require("moment");
const newStudentLeaveLog = async (startDate, endDate, startHalf, endHalf, student_id) => {
  console.log(startDate, endDate, startHalf, endHalf, student_id)
  // Create a new moment object with the start date
  let currentDate = moment(startDate);

  // Create a new array to store the result
  let resultArray = [];

  // Loop through the dates until the end date
  while (currentDate <= moment(endDate)) {
    // Create a new object for the current date
    let currentDateObj = {};

    // Add the faculty_id to the current date object
    currentDateObj.student_id = student_id;

    // Add the date string to the current date object
    currentDateObj.date = currentDate.format('YYYY-MM-DD');

    // Add the hardcoded value based on startHalf and endHalf
    if (currentDateObj.date === startDate && startHalf === 1) {
      currentDateObj.day = 0.5;
    } else if (currentDateObj.date === endDate && endHalf === 1) {
      currentDateObj.day = 0.5;
    } else {
      currentDateObj.day = 1;
    }

    // Add the current date object to the result array
    resultArray.push(currentDateObj);

    // Move to the next day
    currentDate.add(1, 'day');
  }


  console.log(JSON.stringify(resultArray))
  var insertResult = await insertMultiple('leave_student_month_log', resultArray)
  return
}

const checkForStudentLeave = async (startDate, endDate, student_id) => {
  console.log(startDate + "\n\n\n" + endDate + "\n\n" + student_id)
  var allowanceLeave = await query(`SELECT * FROM leave_allowance WHERE role_type='student'`)
  allowanceLeave = allowanceLeave.response[0].allowance

  var startMonthLeaveTaken = await query(`SELECT COALESCE(SUM(day), 0) as total_days
  FROM leave_student_month_log
  WHERE student_id =${student_id}
  AND YEAR(date) = YEAR(DATE('${startDate}'))
  AND MONTH(date) = MONTH(DATE('${startDate}'));`)
  startMonthLeaveTaken = startMonthLeaveTaken.response[0].total_days;

  var endMonthLeaveTaken = await query(`SELECT COALESCE(SUM(day), 0) as total_days
  FROM leave_student_month_log
  WHERE student_id =${student_id}
  AND YEAR(date) = YEAR(DATE('${endDate}'))
  AND MONTH(date) = MONTH(DATE('${endDate}'));`)
  endMonthLeaveTaken = endMonthLeaveTaken.response[0].total_days;


  if (moment(startDate).isSame(endDate, 'month')) {


    if (startMonthLeaveTaken <= allowanceLeave) {
      console.log(JSON.stringify({ success: true }))

      return { success: true };
    }
    else {
      console.log(JSON.stringify({ success: false, message: `You have only ${allowanceLeave - startMonthLeaveTaken} Leave Day of this month` }))

      return { success: false, message: `You have only ${allowanceLeave - startMonthLeaveTaken} Leave Day of this month` };
    }
  } else {

    const result = getDaysInMonthsBetweenDates(startDate, endDate);

    if (result.firstMonthDays > (allowanceLeave - startMonthLeaveTaken)) {
      console.log(JSON.stringify({ success: false, message: `You have only ${(allowanceLeave - startMonthLeaveTaken)} Leave Day in start date month` }))
      return { success: false, message: `You have only ${(allowanceLeave - startMonthLeaveTaken)} Leave Day in start date month` };

    }

    if (result.lastMonthDays > (allowanceLeave - endMonthLeaveTaken)) {
      console.log(JSON.stringify({ success: false, message: `You have only ${(allowanceLeave - endMonthLeaveTaken)} Leave Day in end date month` }))
      return { success: false, message: `You have only ${(allowanceLeave - endMonthLeaveTaken)} Leave Day in end date month` };
    }

    var doubleAllowance = (allowanceLeave - startMonthLeaveTaken) + allowanceLeave;
    let numDays = Math.round(((moment(endDate)).valueOf() - (moment(startDate)).valueOf()) / 86400000);
    if (numDays <= doubleAllowance) {
      console.log(JSON.stringify({ success: true }))

      return { success: true };
    }
    else {
      console.log(JSON.stringify({ success: false, message: `You have only ${doubleAllowance} Leave Day in total` }))
      return { success: false, message: `You have only ${doubleAllowance} Leave Day in total` };
    }
  }
}

const newFacultyLeaveLog = async (startDate, endDate, startHalf, endHalf, faculty_id) => {
  console.log(startDate, endDate, startHalf, endHalf, faculty_id)
  // Create a new moment object with the start date
  let currentDate = moment(startDate);

  // Create a new array to store the result
  let resultArray = [];

  // Loop through the dates until the end date
  while (currentDate <= moment(endDate)) {
    // Create a new object for the current date
    let currentDateObj = {};

    // Add the faculty_id to the current date object
    currentDateObj.faculty_id = faculty_id;

    // Add the date string to the current date object
    currentDateObj.date = currentDate.format('YYYY-MM-DD');

    // Add the hardcoded value based on startHalf and endHalf
    if (currentDateObj.date === startDate && startHalf === 1) {
      currentDateObj.day = 0.5;
    } else if (currentDateObj.date === endDate && endHalf === 1) {
      currentDateObj.day = 0.5;
    } else {
      currentDateObj.day = 1;
    }

    // Add the current date object to the result array
    resultArray.push(currentDateObj);

    // Move to the next day
    currentDate.add(1, 'day');
  }


  console.log(JSON.stringify(resultArray))
  var insertResult = await insertMultiple('leave_faculty_month_log', resultArray)
  return
}
const checkForFacultyLeave = async (startDate, endDate, faculty_id) => {
  console.log(startDate + "\n\n\n" + endDate + "\n\n" + faculty_id)
  var allowanceLeave = await query(`SELECT * FROM leave_allowance WHERE role_type='faculty'`)
  allowanceLeave = allowanceLeave.response[0].allowance

  var startMonthLeaveTaken = await query(`SELECT COALESCE(SUM(day), 0) as total_days
  FROM leave_faculty_month_log
  WHERE faculty_id =${faculty_id}
  AND YEAR(date) = YEAR(DATE('${startDate}'))
  AND MONTH(date) = MONTH(DATE('${startDate}'));`)
  startMonthLeaveTaken = startMonthLeaveTaken.response[0].total_days;

  var endMonthLeaveTaken = await query(`SELECT COALESCE(SUM(day), 0) as total_days
  FROM leave_faculty_month_log
  WHERE faculty_id =${faculty_id}
  AND YEAR(date) = YEAR(DATE('${endDate}'))
  AND MONTH(date) = MONTH(DATE('${endDate}'));`)
  endMonthLeaveTaken = endMonthLeaveTaken.response[0].total_days;


  if (moment(startDate).isSame(endDate, 'month')) {


    if (startMonthLeaveTaken <= allowanceLeave) {
      console.log(JSON.stringify({ success: true }))

      return { success: true };
    }
    else {
      console.log(JSON.stringify({ success: false, message: `You have only ${allowanceLeave - startMonthLeaveTaken} Leave Day of this month` }))

      return { success: false, message: `You have only ${allowanceLeave - startMonthLeaveTaken} Leave Day of this month` };
    }
  } else {

    const result = getDaysInMonthsBetweenDates(startDate, endDate);

    if (result.firstMonthDays > (allowanceLeave - startMonthLeaveTaken)) {
      console.log(JSON.stringify({ success: false, message: `You have only ${(allowanceLeave - startMonthLeaveTaken)} Leave Day in start date month` }))
      return { success: false, message: `You have only ${(allowanceLeave - startMonthLeaveTaken)} Leave Day in start date month` };

    }

    if (result.lastMonthDays > (allowanceLeave - endMonthLeaveTaken)) {
      console.log(JSON.stringify({ success: false, message: `You have only ${(allowanceLeave - endMonthLeaveTaken)} Leave Day in end date month` }))
      return { success: false, message: `You have only ${(allowanceLeave - endMonthLeaveTaken)} Leave Day in end date month` };
    }

    var doubleAllowance = (allowanceLeave - startMonthLeaveTaken) + allowanceLeave;
    let numDays = Math.round(((moment(endDate)).valueOf() - (moment(startDate)).valueOf()) / 86400000);
    if (numDays <= doubleAllowance) {
      console.log(JSON.stringify({ success: true }))

      return { success: true };
    }
    else {
      console.log(JSON.stringify({ success: false, message: `You have only ${doubleAllowance} Leave Day in total` }))
      return { success: false, message: `You have only ${doubleAllowance} Leave Day in total` };
    }
  }
}


const getLeavtype = async (reqBody) => {
  try {
    let result = await query(`SELECT * FROM leave_type`);
    if (result.status)
      return new ResponseModel(true, "FETCHED", { list: result.response });
    else return new ResponseModel(false, "FAILED SOS ADD", {});
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const checkNewLeaveForFaculty = async (reqBody) => {
  try {
    const check = await query(
      `SELECT * FROM leave_faculty WHERE faculty_id=${reqBody.faculty_id} AND status_id=1`
    );

    if (check.response.length > 0)
      return new ResponseModel(false, "ALREADY YOUR LEAVE IS REQUESTED", {});
    else return new ResponseModel(true, "GO FOR NEXT LEAVE DETAIL", {});
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const addFacultyLeave = async (reqBody) => {
  try {
    const checkIsFaculty = await query(
      `SELECT * FROM faculty_map_department WHERE faculty_id=${reqBody.faculty_id} ;`
    );
    if (checkIsFaculty.response.length == 0)
      return new ResponseModel(false, "NO FACULTY FOUND", {});

    const checkAlreadyRequest = await query(
      `SELECT * FROM leave_faculty WHERE faculty_id=${reqBody.faculty_id} AND status_id=1`
    );
    if (checkAlreadyRequest.response.length > 0)
      return new ResponseModel(false, "YOUR ALREADY PENDING REQUESTED", {});

    const checkLeave = await checkForFacultyLeave(reqBody.start_date, reqBody.end_date, reqBody.faculty_id)
    if (!checkLeave.success)
      return new ResponseModel(false, checkLeave.message, {});

    let is_carry_forward = 0;
    let carry_forward_day = 0;
    if (!moment(reqBody.start_date).isSame(reqBody.end_date, 'month')) {
      const result = getDaysInMonthsBetweenDates(reqBody.start_date, reqBody.end_date);

      is_carry_forward = 1;
      carry_forward_day = result.lastMonthDays;
    }

    let insertData = {
      faculty_id: reqBody.faculty_id,
      department_id: checkIsFaculty.response[0].department_id,
      is_hod: 0,
      leave_reason: reqBody.leave_reason,
      start_date: reqBody.start_date,
      end_date: reqBody.end_date,
      status_id: 1,
      leave_type_id: reqBody.leave_type_id,
      is_first_half_go: reqBody.is_first_half_go,
      is_second_half_come: reqBody.is_second_half_come,
      is_carry_forward: is_carry_forward,
      carry_forward_day: carry_forward_day,
    };

    let result = await insert("leave_faculty", insertData);
    if (result.status)
      return new ResponseModel(true, "LEAVE HAS SUBMITTED", {});
    else return new ResponseModel(false, "FAILED TO SUBMITTED", {});
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const addStudentLeave = async (reqBody) => {
  try {
    const checkIsStudent = await query(
      `SELECT * FROM students_map_department WHERE student_id=${reqBody.student_id} ;`
    );
    if (checkIsStudent.response.length == 0)
      return new ResponseModel(false, "NO STUDENT FOUND", {});

    const checkAlreadyRequest = await query(
      `SELECT * FROM leave_student WHERE student_id=${reqBody.student_id} AND status_id=1`
    );
    if (checkAlreadyRequest.response.length > 0)
      return new ResponseModel(false, "YOUR ALREADY PENDING REQUESTED", {});

    const checkLeave = await checkForStudentLeave(reqBody.start_date, reqBody.end_date, reqBody.student_id)
    if (!checkLeave.success)
      return new ResponseModel(false, checkLeave.message, {});

    let is_carry_forward = 0;
    let carry_forward_day = 0;
    if (!moment(reqBody.start_date).isSame(reqBody.end_date, 'month')) {
      const result = getDaysInMonthsBetweenDates(reqBody.start_date, reqBody.end_date);

      is_carry_forward = 1;
      carry_forward_day = result.lastMonthDays;
    }


    let insertData = {
      student_id: reqBody.student_id,
      department_id: checkIsStudent.response[0].department_id,
      leave_reason: reqBody.leave_reason,
      start_date: reqBody.start_date,
      end_date: reqBody.end_date,
      status_id: 1,
      leave_type_id: reqBody.leave_type_id,
      is_first_half_go: reqBody.is_first_half_go,
      is_second_half_come: reqBody.is_second_half_come,
      is_carry_forward: is_carry_forward,
      carry_forward_day: carry_forward_day,
    };

    let result = await insert("leave_student", insertData);
    if (result.status)
      return new ResponseModel(true, "LEAVE HAS SUBMITTED", {});
    else return new ResponseModel(false, "FAILED TO SUBMITTED", {});
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const addHodFacultyLeave = async (reqBody) => {
  try {
    const checkIsHod = await query(
      `SELECT * FROM faculty_map_hod WHERE faculty_id=${reqBody.faculty_id} AND is_delete=0;`
    );
    if (checkIsHod.response.length == 0)
      return new ResponseModel(false, "NO HOD FOUND", {});

    const checkAlreadyRequest = await query(
      `SELECT * FROM leave_faculty WHERE faculty_id=${reqBody.faculty_id} AND status_id=1`
    );
    if (checkAlreadyRequest.response.length > 0)
      return new ResponseModel(false, "YOUR ALREADY PENDING REQUESTED", {});

    const checkLeave = await checkForFacultyLeave(reqBody.start_date, reqBody.end_date, reqBody.faculty_id)
    if (!checkLeave.success)
      return new ResponseModel(false, checkLeave.message, {});

    let is_carry_forward = 0;
    let carry_forward_day = 0;
    if (!moment(reqBody.start_date).isSame(reqBody.end_date, 'month')) {
      const result = getDaysInMonthsBetweenDates(reqBody.start_date, reqBody.end_date);

      is_carry_forward = 1;
      carry_forward_day = result.lastMonthDays;
    }

    let insertData = {
      faculty_id: reqBody.faculty_id,
      department_id: checkIsHod.response[0].department_id,
      is_hod: 1,
      leave_reason: reqBody.leave_reason,
      start_date: reqBody.start_date,
      end_date: reqBody.end_date,
      status_id: 1,
      leave_type_id: reqBody.leave_type_id,
      is_first_half_go: reqBody.is_first_half_go,
      is_second_half_come: reqBody.is_second_half_come,
      is_carry_forward: is_carry_forward,
      carry_forward_day: carry_forward_day,
    };

    let result = await insert("leave_faculty", insertData);
    if (result.status)
      return new ResponseModel(true, "LEAVE HAS SUBMITTED", {});
    else return new ResponseModel(false, "FAILED TO SUBMITTED", {});
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const getHodLeaveRequest = async (reqBody) => {
  try {
    const check = await query(
      `SELECT 
      lf.id, 
      lf.faculty_id, 
      lf.leave_reason,
      lt.leave_type,
      CONCAT(f.first_name, ' ', f.last_name) AS faculty_name, 
      dm.department_name,
      CONCAT(DATEDIFF(lf.end_date, lf.start_date), ' Days (', DATE_FORMAT(lf.start_date, '%M %d, %Y'), ' to ', DATE_FORMAT(lf.end_date, '%M %d, %Y'), ')') AS leaving_period, 
      lf.last_status_update_date ,
      DATE_FORMAT(lf.created_date, '%M %d, %Y') AS requested_date ,
      CASE 
      WHEN lf.is_first_half_go = 1 AND lf.is_second_half_come = 1 THEN '<span class=\"badge badge-success\">First half go, come by second half</span>'
      WHEN lf.is_first_half_go = 1 THEN '<span class=\"badge badge-info\">First half go</span>'
      WHEN lf.is_second_half_come = 1 THEN '<span class=\"badge badge-warning\">Come by second half</span>'
      ELSE '<span class=\"badge badge-secondary\">N/A</span>' 
    END AS leaving_time_label
    FROM 
      leave_faculty lf 
      INNER JOIN faculty_master f ON lf.faculty_id = f.id
      INNER JOIN department_master dm ON lf.department_id = dm.id
      INNER JOIN leave_type lt ON lt.id = lf.leave_type_id
    WHERE 
      lf.is_hod = 1 AND lf.status_id = 1;`
    );
    return new ResponseModel(true, "FETCH", { list: check.response });
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const getFacultyDepartmentWiseLeaveRequest = async (reqBody) => {
  try {
    const check = await query(
      `SELECT 
      lf.id, 
      lf.faculty_id, 
      lf.leave_reason,
      lt.leave_type,
      CONCAT(f.first_name, ' ', f.last_name) AS faculty_name, 
      dm.department_name,
      CONCAT(DATEDIFF(lf.end_date, lf.start_date), ' Days (', DATE_FORMAT(lf.start_date, '%M %d, %Y'), ' to ', DATE_FORMAT(lf.end_date, '%M %d, %Y'), ')') AS leaving_period, 
      lf.last_status_update_date ,
      DATE_FORMAT(lf.created_date, '%M %d, %Y') AS requested_date ,
      CASE 
      WHEN lf.is_first_half_go = 1 AND lf.is_second_half_come = 1 THEN '<span class=\"badge badge-success\">First half go, come by second half</span>'
      WHEN lf.is_first_half_go = 1 THEN '<span class=\"badge badge-info\">First half go</span>'
      WHEN lf.is_second_half_come = 1 THEN '<span class=\"badge badge-warning\">Come by second half</span>'
      ELSE '<span class=\"badge badge-secondary\">N/A</span>' 
    END AS leaving_time_label
    FROM 
      leave_faculty lf 
      INNER JOIN faculty_master f ON lf.faculty_id = f.id
      INNER JOIN faculty_map_department mapD ON mapD.faculty_id=f.id
      INNER JOIN department_master dm ON dm.id = mapD.department_id
      INNER JOIN leave_type lt ON lt.id = lf.leave_type_id
    WHERE mapD.department_id=${reqBody.department_id} AND lf.is_hod=0 AND lf.status_id = 1;`
    );
    return new ResponseModel(true, "FETCH", { list: check.response });
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const getStudentDepartmentWiseLeaveRequest = async (reqBody) => {
  try {
    const check = await query(
      `SELECT 
      lf.id, 
      lf.student_id, 
      lf.leave_reason,
      lt.leave_type,
      CONCAT(f.first_name, ' ', f.last_name) AS student_name, 
      dm.department_name,
      CONCAT(DATEDIFF(lf.end_date, lf.start_date), ' Days (', DATE_FORMAT(lf.start_date, '%M %d, %Y'), ' to ', DATE_FORMAT(lf.end_date, '%M %d, %Y'), ')') AS leaving_period, 
      lf.last_status_update_date ,
      DATE_FORMAT(lf.created_date, '%M %d, %Y') AS requested_date ,
      CASE 
      WHEN lf.is_first_half_go = 1 AND lf.is_second_half_come = 1 THEN '<span class=\"badge badge-success\">First half go, come by second half</span>'
      WHEN lf.is_first_half_go = 1 THEN '<span class=\"badge badge-info\">First half go</span>'
      WHEN lf.is_second_half_come = 1 THEN '<span class=\"badge badge-warning\">Come by second half</span>'
      ELSE '<span class=\"badge badge-secondary\">N/A</span>' 
    END AS leaving_time_label
    FROM 
      leave_student lf 
      INNER JOIN students_master f ON lf.student_id = f.id
      INNER JOIN students_map_department mapD ON mapD.student_id=lf.id
      INNER JOIN department_master dm ON dm.id = mapD.department_id
      INNER JOIN leave_type lt ON lt.id = lf.leave_type_id
    WHERE mapD.department_id=${reqBody.department_id} AND lf.status_id = 1;`
    );
    return new ResponseModel(true, "FETCH", { list: check.response });
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};



const changeStatusLeaveFaculty = async (reqBody) => {
  try {

    const detailResult = await query(`SELECT * ,  (SELECT sm.status FROM leave_status_master sm WHERE sm.id=${reqBody.status_id}) as next_status
    FROM leave_faculty lf
    INNER JOIN faculty_master fm ON lf.faculty_id=fm.id
    WHERE lf.id=${reqBody.id}`)

    if (detailResult.response.length == 0)
      return new ResponseModel(false, "no faculty found", {})

    let updateData = {
      last_status_update_date: moment().format("YYYY-MM-DD"),
      status_reason: reqBody.status_reason,
      status_id: reqBody.status_id,
      status_change_by: reqBody.status_change_by,
      status_change_by_type: reqBody.status_change_by_type,
    };

    let whereData = {
      id: reqBody.id,
    };

    const updateResult = await updateQuery(
      "leave_faculty",
      updateData,
      whereData
    );


    if (reqBody.status_id == 3) {
      var dataLeave = await query(`SELECT * , DATE_FORMAT(start_date,'%Y-%m-%d') as start_date , DATE_FORMAT(end_date,'%Y-%m-%d') as end_date  FROM leave_faculty WHERE id=${reqBody.id}`)
      await newFacultyLeaveLog(dataLeave.response[0].start_date,
        dataLeave.response[0].end_date,
        dataLeave.response[0].is_first_half_go,
        dataLeave.response[0].is_second_half_come,
        dataLeave.response[0].faculty_id);
    }

    if (updateResult.status) {
      statusChangeLeave(detailResult.response[0].email,
        detailResult.response[0].next_status,
        `${detailResult.response[0].first_name} ${detailResult.response[0].last_name}`,
        moment(detailResult.response[0].start_date).format('MMMM Do, YYYY'),
        moment(detailResult.response[0].end_date).format('MMMM Do, YYYY'),
        reqBody.status_change_by_type
      )
      return new ResponseModel(true, "LEAVE UPDATE", {});
    }
    else return new ResponseModel(false, "LEAVE UPDATE FAILED", {});


  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const changeStatusLeaveStudent = async (reqBody) => {
  try {

    const detailResult = await query(`SELECT * ,  (SELECT sm.status FROM leave_status_master sm WHERE sm.id=${reqBody.status_id}) as next_status
    FROM leave_student lf
    INNER JOIN students_master fm ON lf.student_id=fm.id
    WHERE lf.id=${reqBody.id}`)

    if (detailResult.response.length == 0)
      return new ResponseModel(false, "no faculty found", {})



    let updateData = {
      last_status_update_date: moment().format("YYYY-MM-DD"),
      status_reason: reqBody.status_reason,
      status_id: reqBody.status_id,
      status_change_by: reqBody.status_change_by,
      status_change_by_type: reqBody.status_change_by_type,
    };

    let whereData = {
      id: reqBody.id,
    };

    const updateResult = await updateQuery(
      "leave_student",
      updateData,
      whereData
    );

    if (reqBody.status_id == 3) {
      var dataLeave = await query(`SELECT * , DATE_FORMAT(start_date,'%Y-%m-%d') as start_date , DATE_FORMAT(end_date,'%Y-%m-%d') as end_date  FROM leave_student WHERE id=${reqBody.id}`)
      await newStudentLeaveLog(dataLeave.response[0].start_date,
        dataLeave.response[0].end_date,
        dataLeave.response[0].is_first_half_go,
        dataLeave.response[0].is_second_half_come,
        dataLeave.response[0].student_id);
    }


    if (updateResult.status) {
      statusChangeLeave(detailResult.response[0].email,
        detailResult.response[0].next_status,
        `${detailResult.response[0].first_name} ${detailResult.response[0].last_name}`,
        moment(detailResult.response[0].start_date).format('MMMM Do, YYYY'),
        moment(detailResult.response[0].end_date).format('MMMM Do, YYYY'),
        reqBody.status_change_by_type
      )
      return new ResponseModel(true, "LEAVE UPDATE", {});
    }
    else return new ResponseModel(false, "LEAVE UPDATE FAILED", {});

  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const getFacultyAllLeave = async (reqBody) => {
  try {
    const check = await query(
      `SELECT 
      lf.id, 
      lf.faculty_id, 
      lt.leave_type,
      CONCAT(f.first_name, ' ', f.last_name) AS faculty_name, 
      lf.leave_reason, 
      CONCAT(DATEDIFF(lf.end_date, lf.start_date), ' Days (', DATE_FORMAT(lf.start_date, '%M %d, %Y'), ' to ', DATE_FORMAT(lf.end_date, '%M %d, %Y'), ')') AS leaving_period, 
      DATE_FORMAT(lf.last_status_update_date, '%M %d, %Y') AS last_status_update_date,
      s.status,
      DATE_FORMAT(lf.created_date, '%M %d, %Y') AS submit_date,
      lf.status_reason,
      CASE 
      WHEN lf.is_first_half_go = 1 AND lf.is_second_half_come = 1 THEN '<span class=\"badge badge-success\">First half go, come by second half</span>'
      WHEN lf.is_first_half_go = 1 THEN '<span class=\"badge badge-info\">First half go</span>'
      WHEN lf.is_second_half_come = 1 THEN '<span class=\"badge badge-warning\">Come by second half</span>'
      ELSE '<span class=\"badge badge-secondary\">N/A</span>' 
    END AS leaving_time_label
    FROM 
      leave_faculty lf 
      INNER JOIN faculty_master f ON lf.faculty_id = f.id
      INNER JOIN leave_status_master s ON lf.status_id = s.id
      INNER JOIN leave_type lt ON lt.id = lf.leave_type_id
    WHERE 
      lf.faculty_id = ${reqBody.faculty_id}
    ORDER BY lf.id DESC;`
    );
    return new ResponseModel(true, "FETCH", { list: check.response });
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const getFacultyAllLeaveMonthWise = async (reqBody) => {
  try {
    const check = await query(
      `SELECT
      lf.id,
      lf.faculty_id,
      lt.leave_type,
      CONCAT(f.first_name, ' ', f.last_name) AS faculty_name,
      lf.leave_reason,
      CONCAT(
        REPLACE(((SELECT COALESCE(SUM(day), 0) as total_days
        FROM leave_faculty_month_log
        WHERE faculty_id = ${reqBody.faculty_id}
        AND YEAR(date) = YEAR(CURRENT_DATE())
        AND MONTH(date) = MONTH(CURRENT_DATE()))),'.0',''),
        IF(
          DATEDIFF(lf.end_date, lf.start_date) > 0,
          CONCAT(
            ' (',
            DATE_FORMAT(lf.start_date, '%M %d, %Y'),
            ' to ',
            DATE_FORMAT(lf.end_date, '%M %d, %Y'),
            ')'
          ),
          ''
        )
      ) AS leaving_period,
      DATE_FORMAT(lf.last_status_update_date, '%M %d, %Y') AS last_status_update_date,
      s.status,
      DATE_FORMAT(lf.created_date, '%M %d, %Y') AS submit_date,
      lf.status_reason,
      REPLACE(CONCAT(
        CASE
          WHEN lf.is_first_half_go = 1 AND lf.is_second_half_come = 1 THEN '<span class="badge badge-success">First half go, come by second half</span>'
          WHEN lf.is_first_half_go = 1 THEN '<span class="badge badge-info">First half go</span>'
          WHEN lf.is_second_half_come = 1 THEN '<span class="badge badge-warning">Come by second half</span>'
          ELSE '<span class="badge badge-secondary">N/A</span>'
        END,
        IF(lf.is_carry_forward = 1, CONCAT('<span class="badge badge-success">Carry forward ', lf.carry_forward_day, ' Day in Next Month</span>'), '')
      ),'<span class="badge badge-secondary">N/A</span><','<') AS leaving_time_label
    FROM
      leave_faculty lf
      INNER JOIN faculty_master f ON lf.faculty_id = f.id
      INNER JOIN leave_status_master s ON lf.status_id = s.id
      INNER JOIN leave_type lt ON lt.id = lf.leave_type_id
    WHERE
      lf.faculty_id = ${reqBody.faculty_id} AND lf.start_date BETWEEN '${reqBody.start_date}' AND '${reqBody.end_date}'
    ORDER BY lf.id DESC;`
    );
    return new ResponseModel(true, "FETCH", { list: check.response });
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const getStudentAllLeaveMonthWise = async (reqBody) => {
  try {
    const check = await query(
      `SELECT
      lf.id,
      lf.student_id,
      lt.leave_type,
      CONCAT(f.first_name, ' ', f.last_name) AS student_name,
      lf.leave_reason,
      CONCAT(
        REPLACE(((SELECT COALESCE(SUM(day), 0) as total_days
        FROM leave_student_month_log
        WHERE student_id = ${reqBody.student_id}
        AND YEAR(date) = YEAR(CURRENT_DATE())
        AND MONTH(date) = MONTH(CURRENT_DATE()))),'.0',''),
        IF(
          DATEDIFF(lf.end_date, lf.start_date) > 0,
          CONCAT(
            ' (',
            DATE_FORMAT(lf.start_date, '%M %d, %Y'),
            ' to ',
            DATE_FORMAT(lf.end_date, '%M %d, %Y'),
            ')'
          ),
          ''
        )
      ) AS leaving_period,
      DATE_FORMAT(lf.last_status_update_date, '%M %d, %Y') AS last_status_update_date,
      s.status,
      DATE_FORMAT(lf.created_date, '%M %d, %Y') AS submit_date,
      lf.status_reason,
      REPLACE(CONCAT(
        CASE
          WHEN lf.is_first_half_go = 1 AND lf.is_second_half_come = 1 THEN '<span class="badge badge-success">First half go, come by second half</span>'
          WHEN lf.is_first_half_go = 1 THEN '<span class="badge badge-info">First half go</span>'
          WHEN lf.is_second_half_come = 1 THEN '<span class="badge badge-warning">Come by second half</span>'
          ELSE '<span class="badge badge-secondary">N/A</span>'
        END,
        IF(lf.is_carry_forward = 1, CONCAT('<span class="badge badge-success">Carry forward ', lf.carry_forward_day, ' Day in Next Month</span>'), '')
      ),'<span class="badge badge-secondary">N/A</span><','<') AS leaving_time_label
    FROM
      leave_student lf
      INNER JOIN students_master f ON lf.student_id = f.id
      INNER JOIN leave_status_master s ON lf.status_id = s.id
      INNER JOIN leave_type lt ON lt.id = lf.leave_type_id
    WHERE
      lf.student_id = ${reqBody.student_id} AND lf.start_date BETWEEN '${reqBody.start_date}' AND '${reqBody.end_date}'
    ORDER BY lf.id DESC;`
    );
    return new ResponseModel(true, "FETCH", { list: check.response });
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const getFacultyDashboardCount = async (reqBody) => {
  try {
    var allowanceLeave = await query(`SELECT * FROM leave_allowance WHERE role_type='faculty'`)
    allowanceLeave = allowanceLeave.response[0].allowance

    var currentMonthLeave = await query(`SELECT COALESCE(SUM(day), 0) as total_days
    FROM leave_faculty_month_log
    WHERE faculty_id = ${reqBody.faculty_id}
    AND YEAR(date) = YEAR(CURRENT_DATE())
    AND MONTH(date) = MONTH(CURRENT_DATE());`)
    currentMonthLeave = currentMonthLeave.response[0].total_days;

    return new ResponseModel(true, "FETCHED", { allowanceLeave: allowanceLeave, pendingLeave: allowanceLeave - currentMonthLeave });

  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const getStudentDashboardCount = async (reqBody) => {
  try {
    var allowanceLeave = await query(`SELECT * FROM leave_allowance WHERE role_type='student'`)
    allowanceLeave = allowanceLeave.response[0].allowance

    var currentMonthLeave = await query(`SELECT COALESCE(SUM(day), 0) as total_days
    FROM leave_student_month_log
    WHERE student_id = ${reqBody.student_id}
    AND YEAR(date) = YEAR(CURRENT_DATE())
    AND MONTH(date) = MONTH(CURRENT_DATE());`)
    currentMonthLeave = currentMonthLeave.response[0].total_days;

    return new ResponseModel(true, "FETCHED", { allowanceLeave: allowanceLeave, pendingLeave: allowanceLeave - currentMonthLeave });

  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const getStudentAllLeave = async (reqBody) => {
  try {
    const check = await query(
      `SELECT 
      lf.id, 
      lf.student_id, 
      lt.leave_type,
      CONCAT(f.first_name, ' ', f.last_name) AS student_name, 
      lf.leave_reason, 
      CONCAT(DATEDIFF(lf.end_date, lf.start_date), ' Days (', DATE_FORMAT(lf.start_date, '%M %d, %Y'), ' to ', DATE_FORMAT(lf.end_date, '%M %d, %Y'), ')') AS leaving_period, 
      DATE_FORMAT(lf.last_status_update_date, '%M %d, %Y') AS last_status_update_date,
      s.status,
      DATE_FORMAT(lf.created_date, '%M %d, %Y') AS submit_date,
      lf.status_reason,
      CASE 
      WHEN lf.is_first_half_go = 1 AND lf.is_second_half_come = 1 THEN '<span class=\"badge badge-success\">First half go, come by second half</span>'
      WHEN lf.is_first_half_go = 1 THEN '<span class=\"badge badge-info\">First half go</span>'
      WHEN lf.is_second_half_come = 1 THEN '<span class=\"badge badge-warning\">Come by second half</span>'
      ELSE '<span class=\"badge badge-secondary\">N/A</span>' 
    END AS leaving_time_label
    FROM 
      leave_student lf 
      INNER JOIN students_master f ON lf.student_id = f.id
      INNER JOIN leave_status_master s ON lf.status_id = s.id
      INNER JOIN leave_type lt ON lt.id = lf.leave_type_id
    WHERE 
      lf.student_id = ${reqBody.student_id}
    ORDER BY lf.id DESC;`
    );
    return new ResponseModel(true, "FETCH", { list: check.response });
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};


const updateLeave = async (reqBody) => {
  try {

    await query(`UPDATE leave_allowance SET allowance=${reqBody.allowance} WHERE role_type='${reqBody.role_type}'`)
    return new ResponseModel(true, "UPDATE", {});
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const getDaysInMonthsBetweenDates = (startDate, endDate) => {
  const start = moment(startDate);
  const end = moment(endDate);

  const startMonthDays = start.daysInMonth();
  const endMonthDays = end.daysInMonth();

  const firstMonthDays = startMonthDays - start.date() + 1;
  const lastMonthDays = end.date();

  const totalDays = firstMonthDays + lastMonthDays;
  const daysInBetweenMonths = (end.year() - start.year()) * 12 + end.month() - start.month() - 1;

  let daysInMiddleMonths = 0;
  for (let i = 1; i <= daysInBetweenMonths; i++) {
    const currentMonth = start.clone().add(i, 'months');
    daysInMiddleMonths += currentMonth.daysInMonth();
  }

  return {
    firstMonthDays,
    daysInMiddleMonths,
    lastMonthDays,
    totalDays
  };
};


const getAllLeaveAllowance = async (reqBody) => {
  try {
    const check = await query(
      `SELECT * FROM leave_allowance;`
    );
    return new ResponseModel(true, "FETCH", { list: check.response });
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};


const setAllowanceLeave = async (reqBody) => {
  try {
    const check = await query(
      `UPDATE leave_allowance SET allowance='${reqBody.allowance}' WHERE role_type = '${reqBody.role_type}';`
    );
    return new ResponseModel(true, "FETCH", {});
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const getStudentAllLeaveHistory = async (reqBody) => {
  try {
    const check = await query(
      `SELECT 
      ls.id, 
      ls.student_id, 
      ls.leave_reason,
      lt.leave_type,
      CONCAT(f.first_name, ' ', f.last_name) AS name, 
      dm.department_name,
      s.status,
      ls.status_reason,
      DATE_FORMAT(ls.created_date, '%M %d, %Y') AS submit_date,
      CONCAT(DATEDIFF(ls.end_date, ls.start_date), ' Days (', DATE_FORMAT(ls.start_date, '%M %d, %Y'), ' to ', DATE_FORMAT(ls.end_date, '%M %d, %Y'), ')') AS leaving_period, 
      ls.last_status_update_date ,
      DATE_FORMAT(ls.created_date, '%M %d, %Y') AS requested_date ,
      CASE 
      WHEN ls.is_first_half_go = 1 AND ls.is_second_half_come = 1 THEN '<span class=\"badge badge-success\">First half go, come by second half</span>'
      WHEN ls.is_first_half_go = 1 THEN '<span class=\"badge badge-info\">First half go</span>'
      WHEN ls.is_second_half_come = 1 THEN '<span class=\"badge badge-warning\">Come by second half</span>'
      ELSE '<span class=\"badge badge-secondary\">N/A</span>' 
    END AS leaving_time_label
FROM leave_student ls
INNER JOIN students_master f ON ls.student_id = f.id
INNER JOIN students_map_department mapD ON mapD.student_id=f.id
INNER JOIN department_master dm ON dm.id = mapD.department_id
INNER JOIN leave_type lt ON lt.id = ls.leave_type_id
INNER JOIN leave_status_master s ON ls.status_id = s.id
WHERE ls.student_id=${reqBody.student_id};`
    );
    return new ResponseModel(true, "FETCH", { list: check.response });
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

const getFacultyAllLeaveHistory = async (reqBody) => {
  try {
    const check = await query(
      `SELECT 
      ls.id, 
      ls.faculty_id, 
      ls.leave_reason,
      lt.leave_type,
      CONCAT(f.first_name, ' ', f.last_name) AS name, 
      dm.department_name,
      s.status,
      ls.status_reason,
      DATE_FORMAT(ls.created_date, '%M %d, %Y') AS submit_date,
      CONCAT(DATEDIFF(ls.end_date, ls.start_date), ' Days (', DATE_FORMAT(ls.start_date, '%M %d, %Y'), ' to ', DATE_FORMAT(ls.end_date, '%M %d, %Y'), ')') AS leaving_period, 
      ls.last_status_update_date ,
      DATE_FORMAT(ls.created_date, '%M %d, %Y') AS requested_date ,
      CASE 
      WHEN ls.is_first_half_go = 1 AND ls.is_second_half_come = 1 THEN '<span class=\"badge badge-success\">First half go, come by second half</span>'
      WHEN ls.is_first_half_go = 1 THEN '<span class=\"badge badge-info\">First half go</span>'
      WHEN ls.is_second_half_come = 1 THEN '<span class=\"badge badge-warning\">Come by second half</span>'
      ELSE '<span class=\"badge badge-secondary\">N/A</span>' 
    END AS leaving_time_label
FROM leave_faculty ls
INNER JOIN faculty_master f ON ls.faculty_id = f.id
INNER JOIN faculty_map_department mapD ON mapD.faculty_id=f.id
INNER JOIN department_master dm ON dm.id = mapD.department_id
INNER JOIN leave_type lt ON lt.id = ls.leave_type_id
INNER JOIN leave_status_master s ON ls.status_id = s.id
WHERE ls.faculty_id=${reqBody.faculty_id};`
    );
    return new ResponseModel(true, "FETCH", { list: check.response });
  } catch (e) {
    return new ResponseModel(false, e.message, {});
  }
};

module.exports = {
  getLeavtype,
  checkNewLeaveForFaculty,
  addHodFacultyLeave,
  getHodLeaveRequest,
  changeStatusLeaveFaculty,
  getFacultyAllLeave,
  addFacultyLeave,
  getFacultyDepartmentWiseLeaveRequest,
  getStudentAllLeave,
  addStudentLeave,
  getStudentDepartmentWiseLeaveRequest,
  changeStatusLeaveStudent,
  getFacultyAllLeaveMonthWise,
  getFacultyDashboardCount,
  getStudentDashboardCount,
  getStudentAllLeaveMonthWise,
  updateLeave,
  getAllLeaveAllowance,
  setAllowanceLeave,
  getFacultyAllLeaveHistory,
  getStudentAllLeaveHistory
};
