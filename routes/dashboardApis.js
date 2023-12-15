"use strict";
const express = require("express");
const router = express.Router();
const { query } = require("../repo/dbRepo.js");

const { ResponseModel } = require("../models/responseObj.js");
const { checkReq } = require("../repo/commonRepo");

const {
  loginPrinciple,
  loginHod,
  loginFaculty,
  loginStudent,
  loginSystemAdmin,
} = require("../controller/authController");

const {
  getStudentList,
  deactivateStudent,
  getFacultyList,
  deactivateFaculty,
} = require("../controller/findController");

const { principleDashbpoard } = require("../controller/principleController.js");
const {
  addNewDepartment,
  listDepartment,
} = require("../controller/departmentController");
const {
  addNewSystemAdmin,
  listSystemAdmin,
} = require("../controller/systemAdminController");
const {
  facultyEmailVerification,
  addNewFaculty,
  listAllFacultyOfDepartment,
  listAllFaculty_Filter,
} = require("../controller/facultyController");
const { addNewHod, listHod } = require("../controller/hodController");
const {
  hodAddNewStudent,
  listAllStudentOfDepartment,
  studentEmailVerification,
} = require("../controller/studentController");
const { newSosAlert, listSosAlert } = require("../controller/sosController");
const {
  getLeavtype,
  checkNewLeaveForFaculty,
  addHodFacultyLeave,
  getHodLeaveRequest,
  changeStatusLeaveFaculty,
  getFacultyAllLeave,
  addFacultyLeave,
  getFacultyDepartmentWiseLeaveRequest,
  addStudentLeave,
  getStudentAllLeave,
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
} = require("../controller/leaveController");

router.post("/login", async (req, res) => {
  try {
    const requiredParams = ["username", "password", "role"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    let role = req.body.role;
    if (role == "principle") {
      return res.status(200).send(await loginPrinciple(req.body, req.session));
    } else if (role == "hod") {
      return res.status(200).send(await loginHod(req.body, req.session));
    } else if (role == "faculty") {
      return res.status(200).send(await loginFaculty(req.body, req.session));
    } else if (role == "student") {
      return res.status(200).send(await loginStudent(req.body, req.session));
    } else if (role == "systemadmin") {
      return res
        .status(200)
        .send(await loginSystemAdmin(req.body, req.session));
    } else {
      res.redirect("/logout");
    }
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/department/add", async (req, res) => {
  try {
    const requiredParams = ["department_name", "department_code"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    return res.status(200).send(await addNewDepartment(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/department/list", async (req, res) => {
  try {
    return res.status(200).send(await listDepartment(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/systemadmin/add", async (req, res) => {
  try {
    const requiredParams = ["first_name", "last_name", "username", "password"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    return res.status(200).send(await addNewSystemAdmin(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/systemadmin/list", async (req, res) => {
  try {
    return res.status(200).send(await listSystemAdmin(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/faculty/facultyEmailVerification", async (req, res) => {
  try {
    const requiredParams = ["email"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    return res.status(200).send(await facultyEmailVerification(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/student/studentEmailVerification", async (req, res) => {
  try {
    const requiredParams = ["email"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    return res.status(200).send(await studentEmailVerification(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/faculty/add", async (req, res) => {
  try {
    const requiredParams = [
      "first_name",
      "last_name",
      "gender",
      "department_id",
      "joining_date",
      "username",
      "password",
      "email",
    ];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    return res.status(200).send(await addNewFaculty(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/faculty/listAllFacultyOfDepartment", async (req, res) => {
  try {
    const requiredParams = ["department_id"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    return res.status(200).send(await listAllFacultyOfDepartment(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/faculty/listAllFaculty_Filter", async (req, res) => {
  try {
    const requiredParams = ["department_id"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    return res.status(200).send(await listAllFaculty_Filter(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/hod/add", async (req, res) => {
  try {
    const requiredParams = ["faculty_id", "department_id"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    return res.status(200).send(await addNewHod(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/hod/addNewStudent", async (req, res) => {
  try {
    const requiredParams = [
      "first_name",
      "last_name",
      "gender",
      "username",
      "password",
      "email",
    ];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    if (!req.session.admin) {
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));
    }
    let hodDetail = await query(
      `SELECT * FROM faculty_map_department WHERE faculty_id=${req.session.admin.id}`
    );

    if (hodDetail.response.length == 0)
      return res
        .status(200)
        .send(new ResponseModel(false, "ONLY HOD CAN ADD STUDENT", {}));

    req.body["department_id"] = hodDetail.response[0].department_id;
    return res.status(200).send(await hodAddNewStudent(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/hod/listAllStudentOfDepartment", async (req, res) => {
  try {
    if (!req.session.admin) {
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));
    }
    let hodDetail = await query(
      `SELECT * FROM faculty_map_department WHERE faculty_id=${req.session.admin.id}`
    );

    if (hodDetail.response.length == 0)
      return res
        .status(200)
        .send(
          new ResponseModel(
            false,
            "ONLY HOD CAN SEE STUDENT VIA THIS ROUTE",
            {}
          )
        );

    req.body["department_id"] = hodDetail.response[0].department_id;
    return res.status(200).send(await listAllStudentOfDepartment(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/hod/listAllFacultyOfDepartment", async (req, res) => {
  try {
    if (!req.session.admin) {
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));
    }
    let hodDetail = await query(
      `SELECT * FROM faculty_map_department WHERE faculty_id=${req.session.admin.id}`
    );

    if (hodDetail.response.length == 0)
      return res
        .status(200)
        .send(
          new ResponseModel(
            false,
            "ONLY HOD CAN SEE STUDENT VIA THIS ROUTE",
            {}
          )
        );

    req.body["department_id"] = hodDetail.response[0].department_id;
    return res.status(200).send(await listAllFacultyOfDepartment(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/hod/list", async (req, res) => {
  try {
    return res.status(200).send(await listHod(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/sos/add", async (req, res) => {
  try {
    const requiredParams = ["sos_text", "start_date", "end_date"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    return res.status(200).send(await newSosAlert(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/sos/list", async (req, res) => {
  try {
    return res.status(200).send(await listSosAlert(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/getTypeleave", async (req, res) => {
  try {
    return res.status(200).send(await getLeavtype(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/checkNewLeaveForFaculty", async (req, res) => {
  try {
    if (!req.session.admin)
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));

    req.body["faculty_id"] = req.session.admin.id;
    return res.status(200).send(await checkNewLeaveForFaculty(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/addHodFacultyLeave", async (req, res) => {
  try {
    if (!req.session.admin)
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));

    const requiredParams = [
      "leave_type_id",
      "is_first_half_go",
      "is_second_half_come",
      "leave_reason",
      "start_date",
      "end_date",
    ];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    req.body["faculty_id"] = req.session.admin.id;
    return res.status(200).send(await addHodFacultyLeave(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/addFacultyLeave", async (req, res) => {
  try {
    if (!req.session.admin)
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));

    const requiredParams = [
      "leave_type_id",
      "is_first_half_go",
      "is_second_half_come",
      "leave_reason",
      "start_date",
      "end_date",
    ];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    req.body["faculty_id"] = req.session.admin.id;
    return res.status(200).send(await addFacultyLeave(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/addStudentLeave", async (req, res) => {
  try {
    if (!req.session.admin)
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));

    const requiredParams = [
      "leave_type_id",
      "is_first_half_go",
      "is_second_half_come",
      "leave_reason",
      "start_date",
      "end_date",
    ];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    req.body["student_id"] = req.session.admin.id;
    return res.status(200).send(await addStudentLeave(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/getHodLeaveRequest", async (req, res) => {
  try {
    return res.status(200).send(await getHodLeaveRequest(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/getFacultyDepartmentWiseLeaveRequest", async (req, res) => {
  try {
    if (!req.session.admin) {
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));
    }
    let facultyDetail = await query(
      `SELECT * FROM faculty_map_department WHERE faculty_id=${req.session.admin.id}`
    );

    req.body["department_id"] = facultyDetail.response[0].department_id;

    return res
      .status(200)
      .send(await getFacultyDepartmentWiseLeaveRequest(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/getStudentDepartmentWiseLeaveRequest", async (req, res) => {
  try {
    if (!req.session.admin) {
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));
    }
    let facultyDetail = await query(
      `SELECT * FROM faculty_map_department WHERE faculty_id=${req.session.admin.id}`
    );

    req.body["department_id"] = facultyDetail.response[0].department_id;

    return res
      .status(200)
      .send(await getStudentDepartmentWiseLeaveRequest(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/principleChangeStatusLeaveHOD", async (req, res) => {
  try {
    if (!req.session.admin)
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));

    const requiredParams = ["status_reason", "status_id", "id"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    req.body["status_change_by"] = req.session.admin.id;
    req.body["status_change_by_type"] = "PRINCIPLE";

    return res.status(200).send(await changeStatusLeaveFaculty(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/hodChangeStatusLeaveFaculty", async (req, res) => {
  try {
    if (!req.session.admin)
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));

    const requiredParams = ["status_reason", "status_id", "id"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    req.body["status_change_by"] = req.session.admin.id;
    req.body["status_change_by_type"] = "HOD";
    return res.status(200).send(await changeStatusLeaveFaculty(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/hodChangeStatusLeaveStudent", async (req, res) => {
  try {
    if (!req.session.admin)
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));

    const requiredParams = ["status_reason", "status_id", "id"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    req.body["status_change_by"] = req.session.admin.id;
    req.body["status_change_by_type"] = "HOD";
    return res.status(200).send(await changeStatusLeaveStudent(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/getFacultyAllLeave", async (req, res) => {
  try {
    if (!req.session.admin)
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));

    req.body["faculty_id"] = req.session.admin.id;
    return res.status(200).send(await getFacultyAllLeave(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/getFacultyDashboardCount", async (req, res) => {
  try {
    if (!req.session.admin)
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));

    req.body["faculty_id"] = req.session.admin.id;
    return res.status(200).send(await getFacultyDashboardCount(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/getStudentDashboardCount", async (req, res) => {
  try {
    if (!req.session.admin)
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));

    req.body["student_id"] = req.session.admin.id;
    return res.status(200).send(await getStudentDashboardCount(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/getFacultyAllLeaveMonthWise", async (req, res) => {
  try {
    if (!req.session.admin)
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));

    const requiredParams = ["start_date", "end_date"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    req.body["faculty_id"] = req.session.admin.id;
    return res.status(200).send(await getFacultyAllLeaveMonthWise(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/getStudentAllLeaveMonthWise", async (req, res) => {
  try {
    if (!req.session.admin)
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));

    const requiredParams = ["start_date", "end_date"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    req.body["student_id"] = req.session.admin.id;
    return res.status(200).send(await getStudentAllLeaveMonthWise(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/getStudentAllLeave", async (req, res) => {
  try {
    if (!req.session.admin)
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));

    req.body["student_id"] = req.session.admin.id;
    return res.status(200).send(await getStudentAllLeave(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/principleDashbordData", async (req, res) => {
  try {
    return res.status(200).send(await principleDashbpoard(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/updateLeave", async (req, res) => {
  try {
    if (!req.session.admin)
      return res.status(200).send(new ResponseModel(false, "LOGIN AGAIN", {}));

    const requiredParams = ["allowance", "role_type"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    return res.status(200).send(await updateLeave(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/getAllLeaveAllowance", async (req, res) => {
  try {
    return res.status(200).send(await getAllLeaveAllowance(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/setAllowanceLeave", async (req, res) => {
  try {
    const requiredParams = ["role_type", "allowance"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    return res.status(200).send(await setAllowanceLeave(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/find/students", async (req, res) => {
  try {
    const requiredParams = ["department_id"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    return res.status(200).send(await getStudentList(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/find/studentDeactivate", async (req, res) => {
  try {
    const requiredParams = ["student_id"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    return res.status(200).send(await deactivateStudent(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/find/faculty", async (req, res) => {
  try {
    const requiredParams = ["department_id"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    return res.status(200).send(await getFacultyList(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/find/facultyDeactivate", async (req, res) => {
  try {
    const requiredParams = ["faculty_id"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    return res.status(200).send(await deactivateFaculty(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/getStudentAllLeaveHistory", async (req, res) => {
  try {

    const requiredParams = ["student_id"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    return res.status(200).send(await getStudentAllLeaveHistory(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/leave/getFacultyAllLeaveHistory", async (req, res) => {
  try {

    const requiredParams = ["faculty_id"];
    const missingParam = checkReq(req, requiredParams);
    if (missingParam) {
      return res.status(400).json(missingParam);
    }

    return res.status(200).send(await getFacultyAllLeaveHistory(req.body));
  } catch (error) {
    // Return a 500 Internal Server Error response if an error occurs
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
