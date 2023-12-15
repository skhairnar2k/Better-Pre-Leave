"use strict";
$(document).ready(function () {
  var emailVerified = false;

  $("#gender-switch").bootstrapSwitch();

  $("#btnNew").click(function () {
    $("#modalFaculty").modal("show");
  });

  $("#btnAddStudent").click(function () {
    // get input values
    var firstName = $("#inputFName").val();
    var lastName = $("#inputLName").val();
    var username = $("#inputUsername").val();
    var password = $("#inputPassword").val();
    var genderValue = $("#gender-switch").prop("checked") ? 1 : 2;

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

    if (!emailVerified) {
      alert("EMAIL NOT VERIFIED")
      return
    }

    $.ajax({
      type: "POST",
      url: "/api/hod/addNewStudent",
      data: {
        first_name: firstName,
        last_name: lastName,
        gender: genderValue,
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
      url: "/api/student/studentEmailVerification",
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

  const getStudentList = function () {
    $.ajax({
      url: "/api/hod/listAllStudentOfDepartment",
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
        $("#list-table").DataTable();
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  getStudentList();
});
