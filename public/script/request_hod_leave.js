"use strict";
$(document).ready(function () {
  $("#list-table").on("click", "#approveBtn", function () {
    $("#statusModal").modal("show");
    $("#statusSubmitBtn").attr("data-id", $(this).attr("data-id"));
    $("#statusSubmitBtn").attr("data-status_id", 3);
    $("#statusModal").modal("show");
  });

  $("#list-table").on("click", "#rejectBtn", function () {
    $("#statusModal").modal("show");
    $("#statusSubmitBtn").attr("data-id", $(this).attr("data-id"));
    $("#statusSubmitBtn").attr("data-status_id", 2);
    $("#statusModal").modal("show");
  });

  $("#statusSubmitBtn").click(function () {
    if (
      $(this).attr("data-status_id") == 2 &&
      $("#rejectionReason").val() == ""
    ) {
      alert("Please give reject reason");
      return;
    }

    apiLeavHandle(
      $("#rejectionReason").val(),
      $(this).attr("data-status_id"),
      $(this).attr("data-id")
    );
  });

  const apiLeavHandle = function (status_reason, status_id, id) {
    let param = {
      status_reason: status_reason,
      status_id: status_id,
      id: id,
    };

    $.ajax({
      url: "/api/leave/principleChangeStatusLeaveHOD",
      type: "POST",
      dataType: "json",
      data: param,
      success: function (response) {
        if (response.status) window.location.reload();
        else alert(response.message);
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  const getList = function () {
    $.ajax({
      url: "/api/leave/getHodLeaveRequest",
      type: "POST",
      dataType: "json",
      data: {},
      success: function (response) {
        $("#list-table tbody").empty();

        // Loop through the list and create a row for each item
        $.each(response.response.list, function (index, item) {
          var row = $("<tr>");
          var number = $("<td>").text(index + 1);

          var faculty_name = $("<td>").text(item.faculty_name);
          var department_name = $("<td>").text(item.department_name);
          var reason = $("<td>")
            .append("<strong>" + item.leave_type + "</strong>")
            .append("<br>")
            .append(item.leave_reason);
          var leaving_period = $("<td>")
            .text(item.leaving_period)
            .append("<br>")
            .append(item.leaving_time_label);
          var requested_date = $("<td>").text(item.requested_date);

          var approveBtn = $("<button>")
            .text("Approve")
            .addClass("btn btn-success btn-sm mr-2")
            .attr("id", "approveBtn")
            .attr("data-id", item.id);
          var rejectBtn = $("<button>")
            .text("Reject")
            .addClass("btn btn-danger btn-sm")
            .attr("id", "rejectBtn")
            .attr("data-id", item.id);
          var actions = $("<td>").append(approveBtn, rejectBtn);

          row.append(
            number,
            faculty_name,
            department_name,
            reason,
            leaving_period,
            requested_date,
            actions
          );
          $("#list-table tbody").append(row);
        });
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  getList();
});
