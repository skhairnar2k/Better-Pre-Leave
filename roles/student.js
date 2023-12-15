var navbar = function (username) {
    (this.roleName = "STUDENT"),
      (this.userName = username),
      (this.navList = [
        {
          name: "LEAVE",
          has_menu: false,
          url: "/student/leave",
          active: "",
        },
        {
          name: "HISTORY",
          has_menu: false,
          url: "/student/history",
          active: "",
        },
      ]);
  };
  module.exports = navbar;
  