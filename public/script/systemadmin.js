"use strict";
$(document).ready(function () {
  $("#btnNew").click(function () {
    $("#modalSystemadmin").modal("show");
  });

  $("#btnAddSysAdmin").click(function () {
    // get input values
    var firstName = $("#inputFName").val();
    var lastName = $("#inputLName").val();
    var username = $("#inputUsername").val();
    var password = $("#inputPassword").val();

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

    $.ajax({
      type: "POST",
      url: "/api/systemadmin/add",
      data: {
        first_name: firstName,
        last_name: lastName,
        username: username,
        password: password,
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

  const apiSystemAdmin = function () {
    $.ajax({
      url: "/api/systemadmin/list",
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
          var username = $("<td>").text(item.username);
          var password = $("<td>").text(item.password);
          row.append(number, name, username, password);
          $("#list-table tbody").append(row);
        });
      },
      error: function (error) {
        console.log(error);
      },
    });
  };

  apiSystemAdmin();
});
