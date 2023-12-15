var navbar = function (username) {
  this.roleName = "HOD",
    this.userName = username,
    this.navList = [

      {
        name: "LEAVE",
        has_menu: false,
        url: "/hod/leave",
        active: ""
      },
      {
        name: "PROFESSOR REQUESTED",
        has_menu: false,
        url: "/hod/faculty-leave",
        active: ""
      },
      {
        name: "STUDENT REQUESTED",
        has_menu: false,
        url: "/hod/student-leave",
        active: ""
      },
      {
        name: "DEPARTMENT",
        has_menu: true,
        active: "",
        list: [
          {
            name: "student",
            active: "",
            url: "/hod/student",
          },
          {
            name: "professor",
            active: "",
            url: "/hod/faculty",
          }
        ],
      },
      {
        name: "HISTORY",
        has_menu: false,
        url: "/faculty/history",
        active: "",
      },
    ];
};
module.exports = navbar;
