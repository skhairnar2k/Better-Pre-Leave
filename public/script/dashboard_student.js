$(document).ready(function () {
    var yearStart = moment().startOf("year");
    var yearEnd = moment().endOf("year");

    var ranges = {
        "This Month": [moment().startOf("month"), moment().endOf("month")],
    };

    for (var m = moment(yearStart); m.isBefore(yearEnd); m.add(1, "months")) {
        var monthName = m.format("MMMM YYYY");
        var startDate = m.startOf("month").format("YYYY-MM-DD");
        var endDate = m.endOf("month").format("YYYY-MM-DD");
        ranges[monthName] = [startDate, endDate];
    }

    $("#daterange-btn-leave").daterangepicker(
        {
            ranges: ranges,
            startDate: moment().startOf("month"),
            endDate: moment().endOf("month"),
            locale: {
                format: "YYYY-MM-DD",
            },
            showCustomRangeLabel: false, // remove custom range option
        },
        function (start, end) {
            // Callback function
        }
    );

    $("#daterange-btn-leave").on("apply.daterangepicker", function (ev, picker) {
        var startDate = picker.startDate.format("YYYY-MM-DD");
        var endDate = picker.endDate.format("YYYY-MM-DD");
        getMonthWise(startDate, endDate)
    });



    const getMonthWise = function (start_date, end_date) {

        $.ajax({
            url: "/api/leave/getStudentAllLeaveMonthWise",
            type: "POST",
            dataType: "json",
            data: { start_date: start_date, end_date: end_date },
            success: function (response) {
                $("#list-table tbody").empty();
                if (response.response.list.length == 0) {
                    var row = $("<tr>");
                    var message = $("<td colspan='5'>").text("No records found in selected date period");
                    row.append(message);
                    $("#list-table tbody").append(row);
                } else {
                    // Loop through the list and create a row for each item
                    $.each(response.response.list, function (index, item) {
                        var row = $("<tr>");
                        var number = $("<td>").text(index + 1);

                        var reason = $("<td>")
                            .append("<strong>" + item.leave_type + "</strong>")
                            .append("<br>")
                            .append(item.leave_reason);
                        var leaving_period = $("<td>")
                            .text(item.leaving_period)
                            .append("<br>")
                            .append(item.leaving_time_label);
                        var submit_date = $("<td>").text(item.submit_date);

                        var status = $("<td>").text(item.status);
                        var status_date = "";

                        if (item.status == "Requested") {
                            status.addClass("text-danger");
                        } else if (item.status == "Approved") {
                            status.addClass("text-success");
                            status_date = $("<span>").text(
                                "Last updated on " + item.last_status_update_date
                            );
                        } else if (item.status == "Rejected") {
                            status.addClass("text-danger");
                            status_date = $("<span>").text(
                                "Last updated on " + item.last_status_update_date
                            );
                        }

                        status.append("<br>", status_date);
                        var status_reason = $("<td>").text(item.status_reason);

                        row.append(
                            reason,
                            leaving_period,
                            submit_date,
                            status,
                            status_reason
                        );
                        $("#list-table tbody").append(row);
                    });
                }
            },
            error: function (error) {
                console.log(error);
            },
        });
    };

    const refreshDahsboard = function () {

        $.ajax({
            url: "/api/leave/getStudentDashboardCount",
            type: "POST",
            dataType: "json",
            data: {},
            success: function (response) {
                if (response.status) {
                    $("#allowanceLeave").html(response.response.allowanceLeave)
                    $("#pendingLeave").html(response.response.pendingLeave)
                }
            },
            error: function (error) {
                console.log(error);
            },
        });
    };

    refreshDahsboard();
    // Call getMonthWise with the start and end dates of the selected range
    getMonthWise(moment().startOf("month").format("YYYY-MM-DD"), moment().endOf("month").format("YYYY-MM-DD"));

});
