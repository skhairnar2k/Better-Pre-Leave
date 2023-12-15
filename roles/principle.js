var navbar = function (username) {
    this.roleName = "PRINCIPLE",
        this.userName = username,
        this.navList = [

            {
                "name": "HOD LEAVE",
                "active": "",
                "url": "/priciple/hod-leave",
                "has_menu": false
            },
            {
                "name": "SOS ALERT",
                "active": "",
                "url": "/sos",
                "has_menu": false
            },

            {
                "name": "MASTERS",
                "active": "",
                "has_menu": true,
                "list": [
                    {
                        "name": "department",
                        "active": "",
                        "url": "/department"
                    },
                    {
                        "name": "system admin",
                        "active": "",
                        "url": "/system-admin"
                    },
                    {
                        "name": "professor",
                        "active": "",
                        "url": "/faculty"
                    },
                    {
                        "name": "hod",
                        "active": "",
                        "url": "/hod"
                    },
                    {
                        "name": "leave allowance",
                        "active": "",
                        "url": "/leave-allowance"
                    }


                ]
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

        ]
}
module.exports = navbar;