var navbar = function (username) {
  (this.roleName = "SYSTEM ADMIN"),
    (this.userName = username),
    (this.navList = [
      {
        name: "CONFIG",
        active: "",
        has_menu: true,
        list: [
          {
            name: "department",
            active: "",
            url: "/department",
          },
          {
            name: "professor",
            active: "",
            url: "/faculty",
          },
          {
            name: "hod",
            active: "",
            url: "/hod",
          },
          {
            name: "leave allowance",
            active: "",
            url: "/leave-allowance",
          },
        ],
      },

      {
        name: "FIND",
        active: "",
        has_menu: true,
        list: [
          {
            name: "student",
            active: "",
            url: "/findStudent",
          },
          {
            name: "professor/hod",
            active: "",
            url: "/findFaculty",
          },
        ],
      },
    ]);
};
module.exports = navbar;
