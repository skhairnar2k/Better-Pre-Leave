var navbar = function (username) {
  (this.roleName = "PROFESSOR"),
    (this.userName = username),
    (this.navList = [
      {
        name: "LEAVE",
        has_menu: false,
        url: "/faculty/leave",
        active: "",
      },
      {
        name: "HISTORY",
        has_menu: false,
        url: "/faculty/history",
        active: "",
      },
    ]);
};
module.exports = navbar;
