"use strict";
$(document).ready(function () {
  var today = new Date(); // create a new Date object for today's date

  $("#reservationdate").datetimepicker({
    format: "YYYY-MM-DD",
    minDate: today,
  });

  $("#reservationdate2").datetimepicker({
    format: "YYYY-MM-DD",
  });

  $("#btnNew").click(() => {
    apiCheckLeave();
  });

  $("#btnAddLeave").click(() => {
    var leave_type = $("#selectTypeLeave").val();

    var firstHalfSelected = $("#firstHalf").is(":checked");

    if (leave_type == null || leave_type == 0) {
      alert("Select leave type");
      return;
    }

    if ($("#inputReason").val() == "") {
      alert("Please enter leaving reason");
      return;
    }

    if ($("#joiningDate").val() == "") {
      alert("Please select start date");
      return;
    }

    if ($("#endingDate").val() == "") {
      alert("Please end start date");
      return;
    }

    let is_first_half_go = 0;
    let is_second_half_come = 0;

    var firstHalfSelected = $("#firstHalf").is(":checked");
    if (firstHalfSelected) {
      // First half selected
      is_first_half_go = 1;
    }

    var secondHalfSelected = $("#secondHalf").is(":checked");
    if (secondHalfSelected) {
      // First half selected
      is_second_half_come = 1;
    }

    //Check Date
    var startDate = new Date($("#joiningDate").val());
    var endDate = new Date($("#endingDate").val());

    if (startDate >= endDate) {
      alert("Leave from date must be less than Leave till date");
      return false;
    }

    $.ajax({
      url: "/api/leave/addStudentLeave",
      type: "POST",
      dataType: "json",
      data: {
        leave_type_id: leave_type,
        leave_reason: $("#inputReason").val(),
        start_date: $("#joiningDate").val(),
        end_date: $("#endingDate").val(),
        is_first_half_go: is_first_half_go,
        is_second_half_come: is_second_half_come,
      },
      success: function (response) {
        if (response.status) window.location.reload();
        else alert(response.message);
      },
      error: function (error) {
        console.log(error);
      },
    });
  });

  const apiCheckLeave = function () {
    $.ajax({
      url: "/api/leave/checkNewLeaveForFaculty",
      type: "POST",
      dataType: "json",
      success: function (response) {
        if (response.status) $("#modalLeave").modal("show");
        else alert(response.message);
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  const getList = function () {
    $.ajax({
      url: "/api/leave/getStudentAllLeave",
      type: "POST",
      dataType: "json",
      data: {},
      success: function (response) {
        $("#list-table tbody").empty();

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
            number,
            reason,
            leaving_period,
            submit_date,
            status,
            status_reason
          );
          $("#list-table tbody").append(row);
        });
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  const apiLeaveType = function () {
    $.ajax({
      url: "/api/leave/getTypeleave",
      type: "POST",
      dataType: "json",
      success: function (response) {
        let htmlText2 = `<option value="0" selected disabled >Leave type</option>`;
        $.each(response.response.list, function (index, item) {
          htmlText2 = `${htmlText2}<option value="${item.id}" title="${item.detail}" >${item.leave_type}</option>`;
        });
        $("#selectTypeLeave").html(htmlText2);
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  getList();
  apiLeaveType();
});
