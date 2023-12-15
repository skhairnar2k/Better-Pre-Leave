const express = require("express");
const router = express.Router();
const { session } = require("../middleware/session");

router.get("/", async (req, res) => {
  res.render("login");
});

router.get("/priciple/hod-leave", session, async (req, res) => {
  res.render("principle/request_hod_leave", { navs: res.dashboard });
});

router.get("/logout", async (req, res) => {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

router.get("/dashboard", session, async (req, res) => {
  var roleName = res.dashboard.roleName;
  console.log(res.dashboard.notification_list);

  if (roleName == "HOD") {
    res.render("dashboard_hod", { navs: res.dashboard });
  } else if (roleName == "PROFESSOR") {
    res.render("dashboard_faculty", { navs: res.dashboard });
  } else if (roleName == "STUDENT") {
    res.render("dashboard_student", { navs: res.dashboard });
  } else if (roleName == "SYSTEM ADMIN") {
    res.render("dashboard_systemadmin", { navs: res.dashboard });
  } else {
    res.render("dashboard", { navs: res.dashboard });
  }
});

router.get("/department", session, async (req, res) => {
  res.render("department/department", { navs: res.dashboard });
});

router.get("/system-admin", session, async (req, res) => {
  res.render("systemadmin/systemadmin", { navs: res.dashboard });
});

router.get("/faculty", session, async (req, res) => {
  res.render("faculty/faculty", { navs: res.dashboard });
});

router.get("/faculty/leave", session, async (req, res) => {
  res.render("leave/faculty_leave", { navs: res.dashboard });
});

router.get("/hod", session, async (req, res) => {
  res.render("hod/hod", { navs: res.dashboard });
});

router.get("/hod/student", session, async (req, res) => {
  res.render("student/student", { navs: res.dashboard });
});

router.get("/hod/leave", session, async (req, res) => {
  res.render("leave/hod_leave", { navs: res.dashboard });
});

router.get("/hod/faculty-leave", session, async (req, res) => {
  res.render("hod/request_faculty_leave", { navs: res.dashboard });
});

router.get("/hod/faculty", session, async (req, res) => {
  res.render("faculty/faculty_HOD", { navs: res.dashboard });
});

router.get("/sos", session, async (req, res) => {
  res.render("sos/sos", { navs: res.dashboard });
});

router.get("/student/leave", session, async (req, res) => {
  res.render("leave/student_leave", { navs: res.dashboard });
});

router.get("/hod/student-leave", session, async (req, res) => {
  res.render("hod/request_student_leave", { navs: res.dashboard });
});

router.get("/leave-allowance", session, async (req, res) => {
  res.render("leave/leave_allownace", { navs: res.dashboard });
});

router.get("/findStudent", session, async (req, res) => {
  res.render("find/student", { navs: res.dashboard });
});

router.get("/findFaculty", session, async (req, res) => {
  res.render("find/faculty", { navs: res.dashboard });
});

router.get("/student/history", session, async (req, res) => {
  var user_id = req.session.admin.id;
  res.render("leave/student_leave_history", { navs: res.dashboard, user_id: user_id });
});

router.get("/student/history/:name/:id", session, async (req, res) => {
  var user_id = req.params.id;
  res.render("leave/student_leave_history", { navs: res.dashboard, user_id: user_id });
});

router.get("/faculty/history", session, async (req, res) => {
  var user_id = req.session.admin.id;
  res.render("leave/faculty_leave_history", { navs: res.dashboard, user_id: user_id });
});


router.get("/faculty/history/:name/:id", session, async (req, res) => {
  var user_id = req.params.id;
  res.render("leave/faculty_leave_history", { navs: res.dashboard, user_id: user_id });
});
module.exports = router;
