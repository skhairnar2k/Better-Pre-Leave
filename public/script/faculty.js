"use strict";
$(document).ready(function () {

  var emailVerified = false;

  $("#gender-switch").bootstrapSwitch();
  $("#reservationdate").datetimepicker({
    format: "YYYY-MM-DD",
  });

  $("#select-department-filter").change(function () {
    getFacultyList();
  });

  $("#btnNew").click(function () {
    emailVerified = false;
    $("#modalFaculty").modal("show");
  });

  $("#btnAddFaculty").click(function () {
    // get input values
    var firstName = $("#inputFName").val();
    var lastName = $("#inputLName").val();
    var username = $("#inputUsername").val();
    var password = $("#inputPassword").val();
    var genderValue = $("#gender-switch").prop("checked") ? 1 : 2;
    var department = $("#selectDepartment").val();
    var joining_date = $("#joiningDate").val();

    // validate input values
    if (firstName.trim() === "") {
      alert("Please enter a first name.");
      return false;
    }
    if (lastName.trim() === "") {
      alert("Please enter a last name.");
      return false;
    }
    if (username.trim() === "") {
      alert("Please enter a username.");
      return false;
    }
    if (password.trim() === "") {
      alert("Please enter a password.");
      return false;
    }
    if (department == 0) {
      alert("Please select department.");
      return false;
    }
    if (joining_date === "") {
      alert("Please enter joing date.");
      return false;
    }

    if (!emailVerified) {
      alert("EMAIL NOT VERIFIED")
      return
    }

    $.ajax({
      type: "POST",
      url: "/api/faculty/add",
      data: {
        first_name: firstName,
        last_name: lastName,
        gender: genderValue,
        department_id: department,
        joining_date: joining_date,
        username: username,
        password: password,
        email: $("#inputEmail").val(),
      },
      success: function (response) {
        if (response.status) {
          window.location.reload();
        } else {
          alert(response.message);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        // handle error
        console.log(errorThrown);
      },
    });
  });

  // Show/hide email verification button
  $("#inputEmail").on("input", function () {
    emailVerified = false;

    if ($(this).val() !== "") {
      $("#btnEmailVerify").show();
    } else {
      $("#btnEmailVerify").hide();
    }
  });

  $("#btnVerifyOTP").click(function () {
    const otp = $(this).attr("data-otp")
    const enterOtp = $("#inputOTP").val();
    if (otp == enterOtp) {
      $("#modalOTP").modal("hide");
      emailVerified = true;
      $("#btnEmailVerify").hide();
    }
    else {
      alert("WRONG CODE")
    }
  })
  // Open OTP modal on click of verify email button
  $("#btnEmailVerify").click(function () {

    if ($("#inputEmail").val() == "")
      return

    $.ajax({
      url: "/api/faculty/facultyEmailVerification",
      type: "POST",
      dataType: "json",
      data: { email: $("#inputEmail").val() },
      success: function (response) {
        if (response.status) {
          $("#modalOTP").modal("show");
          $("#btnVerifyOTP").attr("data-otp", response.response.otp)
        }
        else {
          alert(response.message)
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  });

  const apiDepartment = function () {
    $.ajax({
      url: "/api/department/list",
      type: "POST",
      dataType: "json",
      success: function (response) {
        // Clear the table body
        $("#department-table tbody").empty();

        // Loop through the list and create a row for each item
        let htmlText = `<option selected disabled value="0">department list</option>`;
        $.each(response.response.list, function (index, item) {
          htmlText = `${htmlText}<option value="${item.id}" >${item.department_name}</option>`;
        });
        $("#selectDepartment").html(htmlText);

        let htmlText2 = `<option selected value="0">all list</option>`;
        $.each(response.response.list, function (index, item) {
          htmlText2 = `${htmlText2}<option value="${item.id}" >${item.department_name}</option>`;
        });
        $("#select-department-filter").html(htmlText2);

        getFacultyList();
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  const getFacultyList = function () {
    let type = $("#select-department-filter").val();

    $.ajax({
      url: "/api/faculty/listAllFaculty_Filter",
      type: "POST",
      dataType: "json",
      data: {
        department_id: type,
      },
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
          var username = $("<td>").text(item.username);
          var password = $("<td>").text(item.password);
          row.append(number, name, department_name, username, password);
          $("#list-table tbody").append(row);
        });
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  apiDepartment();
});
