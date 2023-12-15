"use strict";
$(document).ready(function () {


  const getFacultyList = function () {

    $.ajax({
      url: "/api/hod/listAllFacultyOfDepartment",
      type: "POST",
      dataType: "json",
      data: {},
      success: function (response) {
        $("#list-table tbody").empty();

        // Loop through the list and create a row for each item
        $.each(response.response.list, function (index, item) {
          var row = $("<tr>");
          var number = $("<td>").text(index + 1);
          var name = $("<td>").text(item.first_name + " " + item.last_name);

          if (item.hod_department_name != null) {
            // Append the HOD department name to the department <td> element
            name.append(" (HOD: " + item.hod_department_name + ")");
          }
          var department_name = $("<td>").text(item.department_name);
          row.append(number, name, department_name);
          $("#list-table tbody").append(row);
        });
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  getFacultyList();
});
