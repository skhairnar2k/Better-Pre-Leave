"use strict";
$(document).ready(function () {

  const togglePassword = document.querySelector('.toggle-password');
  const passwordField = document.querySelector('#password-field');

  togglePassword.addEventListener('click', function () {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    this.classList.toggle('fa-eye');
    this.classList.toggle('fa-eye-slash');
  });


  const roleSelect = $("#role-select");
  const signinForm = $("#signin-form");

  roleSelect.on("change", function () {
    $("body").css("background-image", 'url("/uploadImg/bookshelfbg.jpg")');
    if (roleSelect.val() !== "") {
      signinForm.show();
    } else {
      signinForm.hide();
    }
  });

  $("#signin-form").submit(function (event) {
    event.preventDefault(); // prevent the form from submitting normally

    var role = $("#role-select").val(); // get the selected role value
    var username = $("input[type=text]").val(); // get the username input value
    var password = $("input[type=password]").val(); // get the password input value

    if (role === "") {
      alert("Please select a role.");
      return;
    }

    $.ajax({
      url: "/api/login",
      method: "POST",
      data: {
        role: role,
        username: username,
        password: password,
      },
      success: function (response) {
        if (response.status) {
          window.location.href = "/dashboard";
        } else {
          alert(response.message);
        }
      },
      error: function (xhr, status, error) {
        console.log(error); // handle the error response
      },
    });
  });
});
