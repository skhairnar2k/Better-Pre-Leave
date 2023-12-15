"use strict";

const { query } = require("../repo/dbRepo.js");

const session = async (req, res, next) => {
  if (req.session.admin) {
    let role = req.session.admin.role;
    let username = req.session.admin.username;
    let dashboard;
    let notification_list = [];

    const sos = await query(`SELECT sos_text as notification_text FROM sos_master WHERE start_date >= CURDATE() AND is_delete = 0;`)
    notification_list = notification_list.concat(sos.response);

    if (role == "principle") {
      dashboard = new (require("../roles/principle.js"))(username);
    } else if (role == "hod") {
      var department_name = await query(`SELECT dm.department_name
      FROM faculty_map_department map
      INNER JOIN department_master dm ON dm.id=map.department_id 
      WHERE map.faculty_id=${req.session.admin.id}`)
      department_name = department_name.response[0].department_name;

      username = `${username}<br>(${department_name})`

      notification_list = notification_list.concat(await leaveNotiFaculty(req.session.admin.id));
      dashboard = new (require("../roles/hod.js"))(username);
    } else if (role == "faculty") {
      var department_name = await query(`SELECT dm.department_name
      FROM faculty_map_department map
      INNER JOIN department_master dm ON dm.id=map.department_id 
      WHERE map.faculty_id=${req.session.admin.id}`)
      department_name = department_name.response[0].department_name;

      username = `${username}<br>(${department_name})`

      notification_list = notification_list.concat(await leaveNotiFaculty(req.session.admin.id));
      dashboard = new (require("../roles/faculty.js"))(username);
    } else if (role == "student") {
      var department_name = await query(`SELECT dm.department_name
      FROM students_map_department map
      INNER JOIN department_master dm ON dm.id=map.department_id 
      WHERE map.student_id=${req.session.admin.id}`)
      department_name = department_name.response[0].department_name;

      username = `${username}<br>(${department_name})`

      notification_list = notification_list.concat(await leaveNotiStudent(req.session.admin.id));
      dashboard = new (require("../roles/student.js"))(username);
    } else if (role == "systemadmin") {
      dashboard = new (require("../roles/systemadmin.js"))(username);
    } else {
      res.redirect("/logout");
    }

    for (var i = 0; i < dashboard.navList.length; i++) {
      const parent = dashboard.navList[i];
      if (parent.has_menu) {
        for (var j = 0; j < parent.list.length; j++) {
          if (parent.list[j].url == req.path) {
            parent.list[j].active = "active";
            parent.active = "active";
          }
        }
      } else {
        if (parent.url == req.path) {
          parent.active = "active";
        }
      }
    }

    res.dashboard = dashboard;
    res.dashboard['notification_list'] = notification_list;

    next();
  } else {
    res.redirect("/logout");
  }
};

const leaveNotiFaculty = async function (faculty_id) {
  const result = await query(`SELECT CONCAT( lt.leave_type ,  ' : Current status is ' , ls.status) as notification_text 
  FROM leave_faculty lf 
  INNER JOIN leave_type lt ON lt.id=lf.leave_type_id
  INNER JOIN leave_status_master ls ON ls.id=lf.status_id
  WHERE lf.start_date >= CURDATE() AND lf.faculty_id=${faculty_id};`)

  return result.response;
}


const leaveNotiStudent = async function (student_id) {
  const result = await query(`SELECT CONCAT( lt.leave_type ,  ' : Current status is ' , ls.status) as notification_text 
  FROM leave_student lf 
  INNER JOIN leave_type lt ON lt.id=lf.leave_type_id
  INNER JOIN leave_status_master ls ON ls.id=lf.status_id
  WHERE lf.start_date >= CURDATE() AND lf.student_id=${student_id};`)

  return result.response;
}

module.exports = { session };
