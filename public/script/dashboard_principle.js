$(document).ready(function () {


    const refreshDahsboard = function () {

        $.ajax({
            url: "/api/principleDashbordData",
            type: "POST",
            dataType: "json",
            data: {},
            success: function (response) {
                if (response.status) {
                    $("#allowanceLeaveFaculty").html(response.response.faculty_allowance)
                    $("#allowanceLeaveStudent").html(response.response.student_allowance)
                    $("#onHolidayF").html(response.response.on_holiday_faculty.length)
                    $("#onHolidayS").html(response.response.on_holiday_student.length)

                    var table = $('#myTable').DataTable({
                        data: response.response.on_holiday_faculty,
                        columns: [
                            { data: "name" },
                            { data: "leave_type" },
                            { data: "leaving_period" },
                            { data: "approve_by" }
                        ]
                    });

                    var table = $('#myTable2').DataTable({
                        data: response.response.on_holiday_student,
                        columns: [
                            { data: "name" },
                            { data: "leave_type" },
                            { data: "leaving_period" },
                            { data: "approve_by" }
                        ]
                    });
                }
            },
            error: function (error) {
                console.log(error);
            },
        });
    };

    refreshDahsboard();
});
