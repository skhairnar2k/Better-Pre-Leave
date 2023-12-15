"use strict";
$(document).ready(function () {


  $("#reservationdate").datetimepicker({
    format: "YYYY-MM-DD",
  });

  $("#reservationdate2").datetimepicker({
    format: "YYYY-MM-DD",
  });

  $("#btnNew").click(function () {
    $("#modalSos").modal('show')
  })

  $("#btnSos").click(function () {

    var text = $('#inputAlert').val();
    var startDate = $('#joiningDate').val();
    var endDate = $('#endingDate').val();

    if (text == '') {
      alert('Please enter text');
    }
    else if (startDate == '' || endDate == '') {
      alert('Please select both start and end dates');
    } else if (moment(startDate).isBefore(moment().format('YYYY-MM-DD'))) {
      alert('Start date should be greater than or equal to today');
    } else if (moment(endDate).isSameOrBefore(moment(startDate).format('YYYY-MM-DD'))) {
      alert('End date should be after start date');
    } else {
      $.ajax({
        url: "/api/sos/add",
        method: "POST",
        data: {
          start_date: startDate,
          sos_text: text,
          end_date: endDate,
        },
        success: function (response) {
          window.location.reload()
        },
        error: function (xhr, status, error) {
          console.log(error); // handle the error response
        },
      });
    }



  })

  const apiList = function () {



    $.ajax({
      url: "/api/sos/list",
      type: "POST",
      dataType: "json",
      success: function (response) {
        $("#list-table tbody").empty();

        // Loop through the list and create a row for each item
        $.each(response.response.list, function (index, item) {
          var row = $("<tr>");
          var number = $("<td>").text(index + 1);
          var sos_text = $("<td>").text(item.sos_text);
          var duration = $("<td>").text(item.duration);
          row.append(number, sos_text, duration);
          $("#list-table tbody").append(row);
        });
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  apiList()
});
