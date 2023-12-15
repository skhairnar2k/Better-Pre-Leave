"use strict";
$(document).ready(function () {

  const apiHod = function () {
    $.ajax({
      url: "/api/hod/list",
      type: "POST",
      dataType: "json",
      success: function (response) {
        // Clear the table body
        $("#list-table tbody").empty();

        // Loop through the list and create a row for each item
        $.each(response.response.list, function (index, item) {
          var row = $("<tr>");
          var number = $("<td>").text(index + 1);
          var name = $("<td>").text(item.first_name + " " + item.last_name);
          var department_name = $("<td>").text(item.department_name);
          var username = $("<td>").text(item.username);
          var password = $("<td>").text(item.password);
          row.append(number, name, department_name,username, password);
          $("#list-table tbody").append(row);
        });
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  apiHod();
});
