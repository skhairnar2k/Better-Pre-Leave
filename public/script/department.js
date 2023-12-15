"use strict";
$(document).ready(function () {
  $("#btnNew").click(function () {
    $("#modalDepartment").modal("show");
  });

  $(document).on('click', "#assignHodBtn", function () {
    $("#btnNewHodAssign").attr("data-department_id", $(this).attr("data-department_id"));
    $("#selectFaculty").html("");
    $.ajax({
      url: "/api/faculty/listAllFacultyOfDepartment",
      type: "POST",
      dataType: "json",
      data: {
        department_id: $(this).attr("data-department_id")
      },
      success: function (response) {
        let htmlText = `<option selected disabled value="0">faculty list</option>`;
        $.each(response.response.list, function (index, item) {
          htmlText = `${htmlText}<option value="${item.id}" >${item.first_name} ${item.last_name}</option>`;
        });
        $("#selectFaculty").html(htmlText);
        $("#modalHod").modal("show");
      },
      error: function (error) {
        console.log(error);
      },
    });

  })

  $("#btnAddNewDepartment").click(function () {
    // Get the input values
    var name = $("#inputDName").val();
    var code = $("#inputDCode").val();

        // Check if the input fields are not empty
        if (name && code) {
          // Make an AJAX call to the API to add the new department
          $.ajax({
            url: "/api/department/add",
            type: "POST",
            dataType: "json",
            data: {
              department_name: name,
              department_code: code,
            },
            success: function (response) {
              if (response.status) window.location.reload();
              else alert(response.message);
            },
            error: function (error) {
              console.log(error);
            },
          });
        } else {
          alert("Fill information");
        }
      });

  $("#btnNewHodAssign").click(function () {
    var faculty_id = $("#selectFaculty").val();
    var department_id = $("#btnNewHodAssign").attr("data-department_id");

    if (faculty_id == 0 || department_id == null) {
      alert("CHOOSE FACULTY")
      return
    }

    $.ajax({
      url: "/api/hod/add",
      type: "POST",
      dataType: "json",
      data: {
        department_id: department_id,
        faculty_id: faculty_id,
      },
      success: function (response) {
        if (response.status) window.location.reload();
        else alert(response.message);
      },
      error: function (error) {
        console.log(error);
      },
    });

  })

  const apiDepartment = function () {
    $.ajax({
      url: "/api/department/list",
      type: "POST",
      dataType: "json",
      success: function (response) {
        // Clear the table body
        $("#department-table tbody").empty();

        // Loop through the list and create a row for each item
        $.each(response.response.list, function (index, item) {
          var row = $("<tr>");
          var number = $("<td>").text(index + 1);
          var department = $("<td>").text(item.department_name);
          var code = $("<td>").text(item.code);
          var hodName = $("<td>");

          if (item.hod_first_name && item.hod_last_name) {
            var hodText = item.hod_first_name + " " + item.hod_last_name;
            var changeHodLink = $("<a>")
              .text("Change HOD")
              .attr("id", "assignHodBtn")
              .addClass("change-hod")
              .attr("data-department_id", item.id);

            hodName.text(hodText).append("<br>").append(changeHodLink);
          } else {
            var assignBtn = $("<button>")
              .text("ASSIGN")
              .attr("id", "assignHodBtn")
              .addClass("btn btn-primary")
              .attr("data-department_id", item.id);

            hodName.append(assignBtn);
          }
          row.append(number, department, code, hodName);
          $("#department-table tbody").append(row);
        });
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  apiDepartment();
});
