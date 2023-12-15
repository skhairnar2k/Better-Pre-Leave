"use strict";
$(document).ready(function () {
  $("#select-department").change(function () {
    getStudentList($(this).val());
  });

  const getStudentList = function (department_id) {
    $.ajax({
      url: "/api/find/faculty",
      type: "POST",
      dataType: "json",
      data: { department_id: department_id },
      success: function (response) {
        $("#list-table tbody").empty();

        // Loop through the list and create a row for each item
        $.each(response.response.list, function (index, item) {
          var row = $("<tr>");
          var number = $("<td>").text(index + 1);
          var name = "";
          if (item.is_hod) {
            name = $("<td>").append($("<a>").attr("href", "/faculty/history/" + encodeURIComponent(item.first_name.replace(/\s+/g, '-') + "-" + item.last_name.replace(/\s+/g, '-')) + "/" + item.faculty_id).text(item.first_name + " " + item.last_name + "(HOD)"));
          } else {
            name = $("<td>").append($("<a>").attr("href", "/faculty/history/" + encodeURIComponent(item.first_name.replace(/\s+/g, '-') + "-" + item.last_name.replace(/\s+/g, '-')) + "/" + item.faculty_id).text(item.first_name + " " + item.last_name));
          }

 
          var email = $("<td>").text(item.email);
          var department_name = $("<td>").text(item.department_name);
          var username = $("<td>").text(item.username);
          var password = $("<td>").text(item.password);
          var button = $("<td>").append($("<button>").text("DEACTIVATE"));

          button.find("button").click(function () {
            // Call your API function here
            // Pass any necessary data using variables in the current scopeit
            if (item.is_hod) {
              alert("PLEASE UNASSIGN HOD FIRST FROM DEPARTMENT");
              return;
            }

            if (confirm("ARE SURE DEACTIVATE")) {
              apiDeactivate(item.faculty_id);
            }
          });
          row.append(
            number,
            name,
            email,
            department_name,
            username,
            password,
            button
          );
          $("#list-table tbody").append(row);
        });

        $("#list-table").DataTable();
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  const apiDepartment = function () {
    $.ajax({
      url: "/api/department/list",
      type: "POST",
      dataType: "json",
      success: function (response) {
        let htmlText2 = `<option selected value="0">All Department Students (select to change)</option>`;
        $.each(response.response.list, function (index, item) {
          htmlText2 = `${htmlText2}<option value="${item.id}" >${item.department_name}</option>`;
        });
        $("#select-department").html(htmlText2);
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  const apiDeactivate = function (faculty_id) {
    $.ajax({
      url: "/api/find/facultyDeactivate",
      type: "POST",
      dataType: "json",
      data: { faculty_id: faculty_id },
      success: function (response) {
        window.location.reload();
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  apiDepartment();
  getStudentList(0);
});
