$(document).ready(function () {

    // function to fetch and update table data
    const updateTable = function () {
        $.ajax({
            url: "/api/leave/getAllLeaveAllowance",
            type: "POST",
            dataType: "json",
            data: {},
            success: function (response) {
                $("#list-table tbody").empty();
                if (response.response.list.length == 0) {
                    var row = $("<tr>");
                    var message = $("<td colspan='5'>").text("No records found");
                    row.append(message);
                    $("#list-table tbody").append(row);
                } else {
                    // Loop through the list and create a row for each item
                    $.each(response.response.list, function (index, item) {
                        var row = $("<tr>");
                        var number = $("<td>").text(index + 1);
                        var leaveType = $("<td>").text(item.role_type);
                        var allowance = $("<td>").text(item.allowance);

                        var changeButton = $("<button>").addClass("btn btn-primary btn-sm")
                            .text("Change")
                            .on("click", function () {
                                var newAllowance = prompt("Enter new allowance:");
                                if (newAllowance !== null) {
                                    setAllowance(item.role_type, newAllowance);
                                }
                            });
                        var action = $("<td>").append(changeButton);

                        row.append(number, leaveType, allowance, action);
                        $("#list-table tbody").append(row);
                    });
                }
            },
            error: function (error) {
                console.log(error);
            },
        });
    };

    // function to update allowance using setAllowanceLeave API
    const setAllowance = function (leaveType, allowance) {
        $.ajax({
            url: "/api/leave/setAllowanceLeave",
            type: "POST",
            dataType: "json",
            data: { role_type: leaveType, allowance: allowance },
            success: function (response) {
                updateTable();
            },
            error: function (error) {
                console.log(error);
            },
        });
    };

    // initial table update on page load
    updateTable();
});
