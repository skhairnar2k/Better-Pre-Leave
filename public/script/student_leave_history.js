"use strict";
$(document).ready(function () {
  const getList = function () {
    $.ajax({
      url: "/api/leave/getStudentAllLeaveHistory",
      type: "POST",
      dataType: "json",
      data: { student_id: user_id },
      success: function (response) {
        var list = response.response.list;

        $("#list-table tbody").empty();

        if (list.length == 0) {
          var message = $("<tr>").append($("<td>").attr("colspan", 6).text("No leave history."));
          $("#list-table tbody").append(message);
        } else {
          $.each(list, function (index, item) {
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
              number,
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

  getList();
});
