// parallax
$('.parallax').parallax();
// sideNav collaps
$(".button-collapse").sideNav();
// material select
$('select').material_select();
// close alert_box
$("#card-alert .close").click(function(){$(this).closest("#card-alert").fadeOut("slow")});

// collapse sidenave on click 
$('.side-nav li').click(function(){$(this).sideNav('hide')});

// activate tabs 
$('ul.tabs').tabs();

// date picker 
$('.datepicker').pickadate({
  selectMonths: true, // Creates a dropdown to control month
  selectYears: 15 // Creates a dropdown of 15 years to control year
});

// time picker 
$('.timepicker').pickatime({
  default: 'now',
  twelvehour: false, // change to 12 hour AM/PM clock from 24 hour
  donetext: 'OK',
  autoclose: false,
  vibrate: true // vibrate the device when dragging clock hand
});

// open model
$('.modal').modal();
$('.collapsible').collapsible();

// open close collapsible change icon
$(".collapsible-header.btn").click(function(){
  $(this).children().children().addClass("fa-chevron-up");
  $(this).children().children().removeClass("fa-chevron-down");
  $('.collapsible-header.btn.active i').addClass("fa-chevron-down");
  $('.collapsible-header.btn.active i').removeClass("fa-chevron-up");
});

// Show/Hide Alert
function showAlert(text, success, modal_id) {
  if (success) {
    if ($(".open #modal-card-success").length > 0) {
      $(modal_id+" #modal-card-success").show();
      $(modal_id+" #modal-card-success .card-content p").html(text);
      setTimeout(function(){
        $(modal_id+" #modal-card-success .card-content p").html("");
        $(modal_id+" #modal-card-success").hide();
      }, 5000);
    } else {
      if ($("#card-success")) {
        $("#card-success").show();
        $("#card-success .card-content p").html(text);
        setTimeout(function(){
          $("#card-success .card-content p").html("");
          $("#card-success").hide();
        }, 5000);
      }
    }
  } else{
    if ($(".open #modal-card-error").length > 0) {
      $(modal_id+" #modal-card-error").show();
      $(modal_id+" #modal-card-error .card-content p").html(text);
      setTimeout(function(){
        $(modal_id+" #modal-card-error .card-content p").html("");
        $(modal_id+" #modal-card-error").hide();
      }, 5000);
    } else {
      if ($("#card-error")) {
        $("#card-error").show();
        $("#card-error .card-content p").html(text);
        setTimeout(function(){
          $("#card-error .card-content p").html("");
          $("#card-error").hide();
        }, 5000);
      }
    }
  }
}

// REGISTER
// $('#registerFrm input[name="confirmpassword"').keypress(function(e) {
//   if(e.which == 13) {
//     onRegister();
//   }
// });
$("#registerFrm").submit(function(){
  $('#registerFrm #registerBtn').prop('disabled', true);
  $('#registerFrm #registerBtn').html("Registering...");
  $.ajax({
    type: 'POST',
    url: '/auth/register',
    dataType: 'json',
    data: $('#registerFrm').serialize(),
    error: function(resp) {
      $('#registerFrm #registerBtn').prop('disabled', false);
      $('#registerFrm #registerBtn').html("Register");
      showAlert(resp.responseJSON.error);
    },
    success: function(resp) {
      window.location.href = window.location.origin + '/otp';
    }
  });
  return false;
});
// END - REGISTER


// OTP
$("#otpFrm").submit(function(){
  $('#otpFrm #otpBtn').prop('disabled', true);
  $('#otpFrm #otpBtn').html("Verifying...");
  $.ajax({
    type: 'POST',
    url: '/auth/otp',
    dataType: 'json',
    data: $('#otpFrm').serialize(),
    error: function(resp) {
      $('#otpFrm #otpBtn').prop('disabled', false);
      showAlert(resp.responseJSON.error);
      $('#otpFrm #otpBtn').html("Verify");
    },
    success: function(resp) {
      window.location.href = window.location.origin + '/profile';
    }
  });
  return false;
});

function otpRequestFrm(el){
  $(el).prop('disabled', true);
  $(el).html("Requesting new OTP...");
  $.ajax({
    type: 'POST',
    url: '/auth/otp-request',
    dataType: 'json',
    error: function(resp) {
      $(el).prop('disabled', false);
      showAlert(resp.responseJSON.error);
      $(el).html("Request new OTP");
    },
    success: function(resp) {
      $(el).prop('disabled', false);
      $("#otpRequestFrm input[name='email']").val('');
      $(el).html("Request new OTP");
      showAlert("New OTP sent to you", true);
    }
  });
}
// END- OTP


// LOGIN
$("#loginFrm").submit(function(){
  $('#loginFrm #loginBtn').prop('disabled', true);
  $('#loginFrm #loginBtn').html("Logging in...");
  $.ajax({
    type: 'POST',
    url: '/auth/login',
    dataType: 'json',
    data: $('#loginFrm').serialize(),
    error: function(resp) {
      $('#loginFrm #loginBtn').prop('disabled', false);
      showAlert(resp.responseJSON.error);
      $('#loginFrm #loginBtn').html("Login");
    },
    success: function(resp) {
      // window.location.href = window.location.origin + '/otp';
      // window.location.href = window.location.origin + '/profile';
      window.location.href = window.location.origin + '/programs';
    }
  });
  return false;
});
// END - LOGIN


// FORGOT PASSWORD
$("#forgotPasswordFrm").submit(function(){
  $('#forgotPasswordFrm #forgotPasswordBtn').prop('disabled', true);
  $('#forgotPasswordFrm #forgotPasswordBtn').html("Requesting password");
  $.ajax({
    type: 'POST',
    url: '/auth/forgot-password',
    dataType: 'json',
    data: $('#forgotPasswordFrm').serialize(),
    error: function(resp) {
      $('#forgotPasswordFrm #forgotPasswordBtn').prop('disabled', false);
      showAlert(resp.responseJSON.error);
      $('#forgotPasswordFrm #forgotPasswordBtn').html("Request password");
    },
    success: function(resp) {
      $('#forgotPasswordFrm #forgotPasswordBtn').prop('disabled', false);
      $('#forgotPasswordFrm #forgotPasswordBtn').html("Request password");
      $("#forgotPasswordFrm input[name='email']").val('');
      showAlert("Reset password link sent to you", true);
    }
  });
  return false;
});
// END - FORGOT PASSWORD


// RESET PASSWORD
$("#resetPasswordFrm").submit(function(){
  $('#resetPasswordFrm #resetPasswordBtn').prop('disabled', true);
  $('#resetPasswordFrm #resetPasswordBtn').html("Setting your password...");

  var token = null;
  if (window.location.search && window.location.search != "") {
    var qs = location.search.substring(1).split('=');
    if ((qs[0] == "token") && (qs[1] != null || qs[1] != "")) {
      token = qs[1];
    }
  }

  if (token) {
    var vals = {
      password: $("#resetPasswordFrm input[name='password']").val(),
      confirm_password: $("#resetPasswordFrm input[name='confirm_password']").val(),
      password_reset_token: token
    };
    $.ajax({
      type: 'POST',
      url: '/auth/reset-password',
      dataType: 'json',
      data: JSON.stringify(vals),
      error: function(resp) {
        $('#resetPasswordFrm #resetPasswordBtn').prop('disabled', false);
        $('#resetPasswordFrm #resetPasswordBtn').html("Confirm");
        showAlert(resp.responseJSON.error);
      },
      success: function(resp) {
        window.location.href = window.location.origin + '/login';
      }
    });
    return false;
  } else {
    $('#resetPasswordFrm #resetPasswordBtn').prop('disabled', false);
  }
});
// END - RESET PASSWORD


// FOUNDER STATE SELECT
function onFounderStateChange(el) {
  var state = $(el).val();
  $.ajax({
    type: 'GET',
    url: '/inc-manager/city',
    dataType: 'json',
    data: {"state" : state},
    error: function(resp) {
      showAlert(resp.responseJSON.error);
    },
    success: function(resp) {
      $('select[name="city"]').children().remove();
      $('select[name="city"]').append($("<option>").attr({'value': "", 'disabled': "", 'selected': ""}).text("Select City"));
      $(resp.data).each(function() {
        $('select[name="city"]').append($("<option>").attr({'value': this.name}).text(this.name));
      });
      $('select[name="city"]').prop('disabled', false);
      // $('select[name="city"]').val('');
      $('select[name="city"]').material_select();
      // el.nextSibling.nextElementSibling.className='active';
    }
  });
}
// END - FOUNDER STATE SELECT


// USER STATE SELECT
function onUserStateChange(el) {
  var state = $(el).val();
  $.ajax({
    type: 'GET',
    url: '/inc-manager/city',
    dataType: 'json',
    data: {"state" : state},
    error: function(resp) {
      showAlert(resp.responseJSON.error);
    },
    success: function(resp) {
      $('#userFrm select[name="city"]').children().remove();
      $('#userFrm select[name="city"]').append($("<option>").attr({'value': "", 'disabled': "", 'selected': ""}).text("Select City"));
      $(resp.data).each(function() {
        $('#userFrm select[name="city"]').append($("<option>").attr({'value': this.name}).text(this.name));
      });
      $('#userFrm select[name="city"]').prop('disabled', false);
      $('#userFrm select[name="city"]').material_select();
    }
  });
}
// END - USER STATE SELECT


// FOUNDER CREATE
function onFounderSave() {
  var file = $('#founderFrm input[name="file"]')[0].files[0];
  if (file != undefined && file!=null && file!="") {
    var ft = file.type.split("/")[1];
    if (ft != 'jpg' && ft != 'jpeg' && ft != 'png' && ft != 'tif' && ft != 'bmp') {
      showAlert("Supported photos are jpg, jpeg, png, tif, bmp");
      return false;
    }
    if (file.size > 1048576) {
      showAlert("Max file size 1 MB");
      return false;
    }
  }

  // if (!is_number(contact_no)) {
  //   showAlert("Invalid contact number! only number allowed");
  //   return false;
  // }

  $('#founderSaveBtn').prop('disabled', true);
  $('#founderSaveBtn').html("Saving...");
  var form_data = new FormData($('#founderFrm')[0]);
  form_data.append("skills", $('#founderFrm select[name="skills"]').val());
  $.ajax({
    type: 'POST',
    url: '/inc-manager/founder',
    // dataType: 'json',
    cache: false,
    contentType: false,
    processData: false,
    // data: JSON.stringify(form_data),
    data: form_data,
    error: function(resp) {
      $('#founderSaveBtn').prop('disabled', false);
      $('#founderSaveBtn').html("Save");
      showAlert(resp.responseJSON.error);
    },
    success: function(resp) {
      window.location.reload();
    }
  });
}
// END - FOUNDER CREATE



// STARTUP CREATE
function onStartupSave() {
  var file = $('#startupFrm input[name="logo"]')[0].files[0];
  if (file != undefined && file!=null && file!="") {
    var ft = file.type.split("/")[1];
    if (ft != 'jpg' && ft != 'jpeg' && ft != 'png' && ft != 'tif' && ft != 'bmp') {
      showAlert("Supported logos are jpg, jpeg, png, tif, bmp");
      return false;
    }
    if (file.size > 1048576) {
      showAlert("Max file size 1 MB");
      return false;
    }
  }

  $('#startupSaveBtn').prop('disabled', true);
  $('#startupSaveBtn').html("Saving...");
  var form_data = new FormData($('#startupFrm')[0]);
  // var form_data = new FormData($('#startupFrm')[0]);

  $.ajax({
    type: 'POST',
    url: '/inc-manager/startup',
    data: form_data,
    cache: false,
    contentType: false,
    processData: false,
    error: function(resp) {
      $('#startupSaveBtn').prop('disabled', false);
      $('#startupSaveBtn').html("Save");
      showAlert(resp.responseJSON.error);
    },
    success: function(resp) {
      window.location.reload();
    }
  });
}
// END - STARTUP CREATE


// COFOUNDER CREATE
function onCofounderAdd() {
  $('#addCofounderBtn').prop('disabled', true);
  $('#addCofounderBtn').html("Adding...");
  var vals = {
    "name" : $('#cofounderFrm input[name="name"]').val(),
    "email" : $('#cofounderFrm input[name="email"]').val(),
    "gender": $('#cofounderFrm input[name="gender"]:checked').val(),
    "contact_no" : $('#cofounderFrm input[name="contact_no"]').val(),
    "linkedin_profile" : $('#cofounderFrm input[name="linkedin_profile"]').val(),
    "state" : $('#cofounderFrm select[name="state"]').val(),
    "city" : $('#cofounderFrm select[name="city"]').val(),
    "college" : $('#cofounderFrm select[name="college"]').val(),
    "skills" : $('#cofounderFrm select[name="skills"]').val(),
    // "proj_course_name" : $('#cofounderFrm select[name="proj_course_name"]').val(),
    // "proj_year_of_study" : $('#cofounderFrm select[name="proj_year_of_study"]').val(),
    // "proj_specialisation" : $('#cofounderFrm select[name="proj_specialisation"]').val(),
    "startup_company_name" : $('#cofounderFrm input[name="startup_company_name"]').val()
  }
  $.ajax({
    type: 'POST',
    url: '/inc-manager/founder/cofounder',
    dataType: 'json',
    data: JSON.stringify(vals),
    error: function(resp) {
      $('#addCofounderBtn').prop('disabled', false);
      $('#addCofounderBtn').html("Add");
      showAlert(resp.responseJSON.error);
    },
    success: function(resp) {
      $('#addCofounderBtn').prop('disabled', false);
      $('#addCofounderBtn').html("Add");
      showAlert("Cofounder added successfully", true);
      $('#cofounderList').children().remove();
      $(resp.data).each(function() {
        $('#cofounderList').append('<tr id="cofounder_row_'+this.id+'"><td>'+this.name+'</td><td>'+this.email+'</td><td>'+this.contact_no+'</td><td class="center"><i class="fa fa-2x fa-trash link" onclick="onDeleteCofounder(this, \''+this.id+'\')"></i></td></tr>');
      });
      
      if (resp.total < 1) {
        $('#cofounderNextBtn').addClass('hide');
      } else {
        $('#cofounderNextBtn').removeClass('hide');
      }

        
      if (resp.total < 3) {
        $('#cofounderFrm').removeClass('hide');
        $('#addCofounderBtn').removeClass('hide');
      } else if (resp.total == 3) {
        $('#cofounderFrm').addClass('hide');
        $('#addCofounderBtn').addClass('hide');
      }
      // if (resp.total == 1) {
      //   $('#cofounderNextBtn').removeClass('hide');
      //   $('#cofounderFrm').addClass('hide');
      //   $('#addCofounderBtn').addClass('hide');
      // } else {
      //   $('#cofounderNextBtn').addClass('hide');
      //   $('#cofounderFrm').removeClass('hide');
      //   $('#addCofounderBtn').removeClass('hide');
      // }

      $('#cofounderFrm input[name="email"]').val('');
      $('#cofounderFrm input[name="name"]').val('');
      $('#cofounderFrm input[name="gender"]').prop('checked', false);
      $('#cofounderFrm input[name="contact_no"]').val('');
      $('#cofounderFrm input[name="linkedin_profile"]').val('');
      $('#cofounderFrm select[name="state"]').val('');
      $('#cofounderFrm select[name="city"]').val('');
      $('#cofounderFrm select[name="college"]').val('');
      $('#cofounderFrm select[name="skills"]').val('');
      // $('#cofounderFrm select[name="proj_course_name"]').val('');
      // $('#cofounderFrm select[name="proj_year_of_study"]').val('');
      // $('#cofounderFrm select[name="proj_specialisation"]').val('');
      $('#cofounderFrm input[name="startup_company_name"]').val('');
      $('select').material_select();
      $('select').val('').trigger('change');
    }
  });
}
// END - COFOUNDER CREATE


// COFOUNDER DELETE
function onDeleteCofounder(el, cofounder_id) {
  var r = confirm("Are you sure you want to delete this team member?");
  if (r != true) {
    return false;
  } else {
    $(el).prop('disabled', true);
    $.ajax({
      type: 'DELETE',
      url: '/inc-manager/founder/cofounder/'+cofounder_id,
      dataType: 'json',
      error: function(resp) {
        $(el).prop('disabled', false);
        showAlert(resp.responseJSON.error);
      },
      success: function(resp) {
        showAlert("Cofounder deleted successfully", true);
        $('#cofounder_row_'+cofounder_id).remove();

        if (resp.total < 1) {
          $('#cofounderNextBtn').addClass('hide');
          $('#cofounderList').append('<tr><td colspan="4"> No Team member exists. Please Add</td></tr>');
        } else {
          $('#cofounderNextBtn').removeClass('hide');
        }

          
        if (resp.total < 3) {
          $('#cofounderFrm').removeClass('hide');
          $('#addCofounderBtn').removeClass('hide');
        } else if (resp.total == 3) {
          $('#cofounderFrm').addClass('hide');
          $('#addCofounderBtn').addClass('hide');
        }

        // if (resp.total == 1) {
        //   $('#cofounderNextBtn').removeClass('hide');
        //   $('#cofounderFrm').addClass('hide');
        //   $('#addCofounderBtn').addClass('hide');
          
        // } else {
        //   $('#cofounderNextBtn').addClass('hide');
        //   $('#cofounderFrm').removeClass('hide');
        //   $('#addCofounderBtn').removeClass('hide');
        //   $('#cofounderList').append('<tr><td colspan="4"> No Team member exists. Please Add</td></tr>');
        // }
      }
    });
  }
}
// END - COFOUNDER DELETE


// USER UPDATE
$('#userFrm').submit(function() {
  $('#userFrm updateUserBtn').prop('disabled', true);
  $('#userFrm updateUserBtn').html("Saving...");
  var vals = {
    "name" : $('#userFrm input[name="name"]').val(),
    "gender": $('#userFrm input[name="gender"]:checked').val(),
    "contact_no" : $('#userFrm input[name="contact_no"]').val(),
    "linkedin_profile" : $('#userFrm input[name="linkedin_profile"]').val(),
    "city" : $('#userFrm select[name="city"]').val(),
    "state" : $('#userFrm select[name="state"]').val(),
    "college" : $('#userFrm select[name="college"]').val(),
    "skills" : $('#userFrm select[name="skills"]').val(),
    // "proj_course_name" : $('#userFrm select[name="proj_course_name"]').val(),
    // "proj_year_of_study" : $('#userFrm select[name="proj_year_of_study"]').val(),
    // "proj_specialisation" : $('#userFrm select[name="proj_specialisation"]').val(),
    "startup_company_name" : $('#userFrm input[name="startup_company_name"]').val()
  }

  if (!is_number(vals["contact_no"])) {
    showAlert("Invalid contact number! only number allowed");
    return false;
  }

  $.ajax({
    type: 'PUT',
    url: '/inc-manager/profile',
    dataType: 'json',
    data: JSON.stringify(vals),
    error: function(resp) {
      $('#userFrm updateUserBtn').prop('disabled', false);
      $('#userFrm updateUserBtn').html("Save");
      showAlert(resp.responseJSON.error);
    },
    success: function(resp) {
      $('#userFrm updateUserBtn').prop('disabled', false);
      $('#userFrm updateUserBtn').html("Save");
      showAlert("User details updated successfully", true);
    }
  });
  return false;
});
// END - USER UPDATE


// EMAIL SUBSCRIPTION UPDATE
// $('#emailSubscriptionFrm').submit(function() {
//   $('#emailSubscriptionFrm updateEmailSubscriptionBtn').prop('disabled', true);
//   $('#emailSubscriptionFrm updateEmailSubscriptionBtn').html("Saving...");
//   var vals = [];
//   $('.email-subscription:checkbox:checked').each(function() {
//     vals.push(this.getAttribute("esid"));
//   });
//   $.ajax({
//     type: 'PUT',
//     url: '/inc-manager/email-subscription',
//     dataType: 'json',
//     data: JSON.stringify({"email_subs_ids": vals}),
//     error: function(resp) {
//       $('#emailSubscriptionFrm updateEmailSubscriptionBtn').prop('disabled', false);
//       $('#emailSubscriptionFrm updateEmailSubscriptionBtn').html("Save");
//       showAlert(resp.responseJSON.error);
//     },
//     success: function(resp) {
//       $('#emailSubscriptionFrm updateEmailSubscriptionBtn').prop('disabled', false);
//       $('#emailSubscriptionFrm updateEmailSubscriptionBtn').html("Save");
//       showAlert("User details updated successfully", true);
//     }
//   });
//   return false;
// });
// END - EMAIL SUBSCRIPTION UPDATE


// CHANGE PASSWORD
$('#changePasswordFrm').submit(function() {
  $('#changePasswordFrm changePasswordBtn').prop('disabled', true);
  $('#changePasswordFrm changePasswordBtn').html("Changing...");
  var vals = {
    "oldpassword" : $('#changePasswordFrm input[name="oldpassword"]').val(),
    "newpassword" : $('#changePasswordFrm input[name="newpassword"]').val(),
    "confirmpassword" : $('#changePasswordFrm input[name="confirmpassword"]').val(),
  }
  $.ajax({
    type: 'POST',
    url: '/inc-manager/profile/change-password',
    dataType: 'json',
    data: JSON.stringify(vals),
    error: function(resp) {
      $('#changePasswordFrm changePasswordBtn').prop('disabled', false);
      $('#changePasswordFrm changePasswordBtn').html("Change");
      showAlert(resp.responseJSON.error);
    },
    success: function(resp) {
      $('#changePasswordFrm changePasswordBtn').prop('disabled', false);
      $('#changePasswordFrm input[name="oldpassword"]').val("");
      $('#changePasswordFrm input[name="newpassword"]').val("");
      $('#changePasswordFrm input[name="confirmpassword"]').val("");
      $('#changePasswordFrm changePasswordBtn').html("Change");
      showAlert("Password changed successfully", true);
    }
  });
  return false;
});
// END - CHANGE PASSWORD


// PROFILE CHANGE PICTURE
function onChangeProfilePic(el) {
  $('#changeProfilePicBtn').prop('disabled', true);
  var form_data = new FormData($("#changeProfilePicFrm")[0]);
  $.ajax({
    type: 'POST',
    url: '/inc-manager/profile/change-picture',
    dataType: 'json',
    data: form_data,
    cache: false,
    contentType: false,
    processData: false,
    error: function(resp) {
      $('#changeProfilePicBtn').prop('disabled', false);
      showAlert(resp.responseJSON.error);
    },
    success: function(resp) {
      $('#changeProfilePicBtn').prop('disabled', false);
      window.location.reload();
    }
  });
}
// END - PROFILE CHANGE PICTURE


// APPLY TO PROGRAM
function onApplyToPgm(el, program_template_id) {
  var r = confirm("Please make sure you are applying under right program/track.You will not be allowed to change once you apply");
  if (r != true) {
    return false;
  } else {
    $('.apply-btn-cls').addClass('disabled');
    $(el).html("Applying...");
    $.ajax({
      type: 'POST',
      url: '/inc-manager/founder/program-template',
      dataType: 'json',
      data: JSON.stringify({"program_template_id": program_template_id}),
      error: function(reps) {
        $('.apply-btn-cls').removeClass('disabled');
        $(el).html("Apply");
        showAlert(resp.responseJSON.error);
      },
      success: function(resp) {
        window.location.href = window.location.origin + '/app/#applicationform';
      }
    });
  }
}
// END - APPLY TO PROGRAM


/*==================== EVENT/SHOWCASE ====================*/

// EVENT ADD CLICK
function onEventAddClick() {
  $('#add_showcase').modal('open');
  $('#add_showcase select[name="program_template_id"]').parent().show();
  $('#add_showcase select[name="program_template_id"]').val("");
  $('#add_showcase input[name="title"]').val("");
  $('#add_showcase textarea[name="description"]').val("");
}
// END - EVENT ADD CLICK

// EVENT CREATE/UPDATE
$('#add_showcase').submit(function() {
  $('#add_showcase addShowcaseBtn').prop('disabled', true);
  $('#add_showcase addShowcaseBtn').html("Saving...");
  var vals = {
    "program_template_id" : $('#add_showcase select[name="program_template_id"]').val(),
    "title" : $('#add_showcase input[name="title"]').val(),
    "description" : $('#add_showcase textarea[name="description"]').val()
  }
  var event_id = $('#add_showcase input[name="event_id"]').val();
  var t = "POST";
  var u = "/inc-manager/event";
  if (event_id != "" && event_id != null && event_id != undefined) {
    t = "PUT";
    u = "/inc-manager/event/"+event_id;
  }

  $.ajax({
    type: t,
    url: u,
    dataType: 'json',
    data: JSON.stringify(vals),
    error: function(resp) {
      $('#add_showcase addShowcaseBtn').prop('disabled', false);
      $('#add_showcase addShowcaseBtn').html("Save");
      showAlert(resp.responseJSON.error);
    },
    success: function(resp) {
      window.location.reload();
    }
  });
  return false;
});
// END - EVENT CREATE/UPDATE

// EVENT UPDATE  CLICK
function onEventEditClick(event_id, pgm_template_id, title, desc) {
  $('#add_showcase').modal('open');
  $('#add_showcase input[name="event_id"]').val(event_id);
  $('#add_showcase select[name="program_template_id"]').val(pgm_template_id);
  $('#add_showcase input[name="title"]').val(title);
  $('#add_showcase textarea[name="description"]').val(desc);
  $('#add_showcase select[name="program_template_id"]').parent().hide();
}
// END - EVENT UPDATE CLICK

// EVENT DELETE
function onEventDelete(el, event_id) {
  var r = confirm("Are you sure you want to delete this Event?");
  if (r != true) {
    return false;
  } else {
    $(el).prop('disabled', true);
    $.ajax({
      type: 'DELETE',
      url: '/inc-manager/event/'+event_id,
      dataType: 'json',
      error: function(resp) {
        $(el).prop('disabled', false);
        showAlert(resp.responseJSON.error);
      },
      success: function(resp) {
        $('#eventRow_'+event_id).remove();
      }
    });
  }
}
// END - EVENT DELETE


// TIMESLOT ADD CLICK
function onEventTimeslotAddClick(event_id) {
  $('#add_timeslot').modal('open');
  $('#add_timeslot input[name="event_id"]').val(event_id);
  $.ajax({
    type: "GET",
    url: '/inc-manager/event/'+event_id,
    dataType: 'json',
    error: function(resp) {
      showAlert(resp.responseJSON.error);
    },
    success: function(resp) {
      $('#add_timeslot #eventTimeslotList').children().remove();
      $(resp.data.timeslots).each(function() {
        $('#add_timeslot #eventTimeslotList').append('<tr id="timeslot_row_'+this.id+'"><td>'+this.date+'</td><td>'+this.start_time+'</td><td>'+this.end_time+'</td><td>'+this.allow_no_of_users+'</td><td><i class="fa fa-2x fa-trash" event_id="'+this.event_id+'" timeslot_id="'+this.id+'" onclick="onTimslotDelete(this)"></i></td></tr>');
      });
    }
  })
}
// END - TIMESLOT ADD CLICK

// TIMESLOT ADD
$('#add_timeslot').submit(function() {
  var modal_id = '#add_timeslot';
  $(modal_id+' #addTimeslotBtn').prop('disabled', true);
  $(modal_id+' #addTimeslotBtn').html("Adding timeslot...");
  var vals = {
    "date" : $(modal_id+' input[name="date"]').val(),
    "start_time" : $(modal_id+' select[name="start_time"]').val(),
    "end_time" : $(modal_id+' select[name="end_time"]').val(),
    "allow_no_of_users" : $(modal_id+' input[name="allow_no_of_users"]').val(),
  }
  var event_id = $(modal_id+' input[name="event_id"]').val();
  $.ajax({
    type: "POST",
    url: "/inc-manager/event/"+event_id+"/timeslot",
    dataType: 'json',
    data: JSON.stringify(vals),
    error: function(resp) {
      $(modal_id+' #addTimeslotBtn').prop('disabled', false);
      $(modal_id+' #addTimeslotBtn').html("Add timeslot");
      showAlert(resp.responseJSON.error);
    },
    success: function(resp) {
      $(modal_id+' #addTimeslotBtn').prop('disabled', false);
      $(modal_id+' #addTimeslotBtn').html("Add timeslot");
      showAlert("Timeslot added successfully", true,modal_id);
      if (resp.data){
        $(modal_id+' #eventTimeslotList').append('<tr id="timeslot_row_'+this.id+'"><td>'+resp.data.date+'</td><td>'+resp.data.start_time+'</td><td>'+resp.data.end_time+'</td><td>'+resp.data.allow_no_of_users+'</td><td><i class="fa fa-2x fa-trash" event_id="'+this.event_id+'" timeslot_id="'+this.id+'" onclick="onTimslotDelete(this)"></i></td></tr>');
      }
    }
  });
  return false;
});
// END - TIMESLOT ADD

// TIMESLOT DELETE
function onTimslotDelete(el) {
  var r = confirm("Are you sure you want to delete this Timeslot?");
  if (r != true) {
    return false;
  } else {
    var event_id = $(el).attr('event_id');
    var timeslot_id = $(el).attr('timeslot_id');
    $(el).prop('disabled', true);
    $.ajax({
      type: 'DELETE',
      url: '/inc-manager/event/'+event_id+'/timeslot/'+timeslot_id,
      dataType: 'json',
      error: function(resp) {
        $(el).prop('disabled', false);
        showAlert(resp.responseJSON.error);
      },
      success: function(resp) {
        showAlert("Timeslot deleted successfully", true);
        $('#timeslot_row_'+timeslot_id).remove();
      }
    });
  }
}
// END - TIMESLOT DELETE

// PARTICIPANT ADD CLICK
function onEventParticipantAddClick(event_id) {
  $('#add_participant').modal('open');
  $('#add_participant input[name="event_id"]').val(event_id);
  onParticipantFilter();
}
// END - INVITEE ADD CLICK


// PARTICIPANT FILTER
function onParticipantFilter(el, filter, pag) {
  var event_id = $('#add_participant input[name="event_id"]').val();
  var filter_by_name = $('#add_participant input[name="filter_by_name"]').val();
  var filter_by_stage = $('#add_participant select[name="filter_by_stage"]').val();
  var page = 1;
  if (pag) {
    page = pag;
  }

  if (filter && filter_by_name!="" && filter_by_name.length < 3) {
    showAlert("If you want to search by name then please maintain minimum 3 characters!");
    return false;
  }
  $.ajax({
    type: "GET",
    url: '/inc-manager/event/'+event_id+'/user-list',
    dataType: 'json',
    data: {"filter_by_name": filter_by_name, "filter_by_stage": filter_by_stage, "page": page},
    error: function(resp) {
      showAlert(resp.responseJSON.error);
    },
    success: function(resp) {
      $('#add_participant #eventParticipantList').children().remove();
      $(resp.data).each(function() {
        if (this.invited) {
          $('#add_participant #eventParticipantList').append('<tr><td>'+this.name+'</td><td>'+this.role+'</td><td>'+this.startup+'</td><td><input class="event-participant" type="checkbox" checked="" id="user_'+this.id+'" value="'+this.id+'" /><label for="user_'+this.id+'"></label></td></tr>');
        } else {
          $('#add_participant #eventParticipantList').append('<tr><td>'+this.name+'</td><td>'+this.role+'</td><td>'+this.startup+'</td><td><input class="event-participant" type="checkbox" id="user_'+this.id+'" value="'+this.id+'" /><label for="user_'+this.id+'"></label></td></tr>');
        }
      });

      // if (resp.pages > 1) {
        var $pagination = $('#pagination');
        var defaultOpts = {
            totalPages: resp.pages,
            visiblePages: 5,
            hideOnlyOnePage: true,
            startPage: resp.currentPage,
            prev: '<i class="material-icons">chevron_left</i>',
            next: '<i class="material-icons">chevron_right</i>',
            first: '',
            firstClass: '',
            last: '',
            lastClass: '',
            onPageClick: function (event, page) {
              // console.info(page + ' (from options)');
            }
        };
        $pagination.twbsPagination('destroy');
        $pagination.twbsPagination(defaultOpts).on('page', function (event, page) {
            console.info(page + " (from event)");
            // window.location.href=window.location.origin+window.location.pathname+"?page="+page;
            onParticipantFilter(el, filter, page);
        });
      // }
    }
  });
}
// END - PARTICIPANT FILTER


// PARTICIPANT ADD
$('#add_participant').submit(function() {
  $('#add_participant addParticipantBtn').prop('disabled', true);
  $('#add_participant addParticipantBtn').html("Saving...");
  var event_id = $('#add_participant input[name="event_id"]').val();
  var vals = [];
  $('#add_participant .event-participant:checkbox:checked').each(function() {
    vals.push(this.value);
  });

  $.ajax({
    type: "POST",
    url: "/inc-manager/event/"+event_id+"/invitee",
    dataType: 'json',
    data: JSON.stringify({"event_id": event_id, "invitees": vals}),
    error: function(resp) {
      $('#add_participant addParticipantBtn').prop('disabled', false);
      $('#add_participant addParticipantBtn').html("Save");
      showAlert(resp.responseJSON.error);
    },
    success: function(resp) {
      $('#add_timeslot addParticipantBtn').prop('disabled', false);
      $('#add_participant addParticipantBtn').html("Save");
      $('#add_participant').modal('close');
    }
  });
  return false;
});
// END - PARTICIPANT ADD

// EVENT PARTICIPANTS
function onEventParticipantsClick(event_id) {
  $('#view_participant').modal('open');
  $.ajax({
    type: "GET",
    url: '/inc-manager/event/'+event_id+'/invitee',
    dataType: 'json',
    error: function(resp) {
      showAlert(resp.responseJSON.error);
    },
    success: function(resp) {
      $('#view_participant #particpantList').children().remove();
      $(resp.data).each(function() {
        if (this.rsvp) {
          $('#view_participant #particpantList').append('<tr><td>'+this.user_name+'</td><td>'+this.user_role+'</td><td>'+this.user_startup+'</td><td>'+this.user_email+'</td><td>'+this.user_contact_no+'</td><td>'+this.user_timeslot+'</td><td>Yes</td></tr>');
        } else {
          $('#view_participant #particpantList').append('<tr><td>'+this.user_name+'</td><td>'+this.user_role+'</td><td>'+this.user_startup+'</td><td>'+this.user_email+'</td><td>'+this.user_contact_no+'</td><td>'+this.user_timeslot+'</td><td>No</td></tr>');
        }
      });
    }
  })
}
// END - EVENT PARTICIPANTS

// EVENT LIVE
function onEventLive(el, event_id) {
  var is_live = $(el).prop("checked");
  if (is_live) {
    $('#event_live_checkbox_'+event_id).html('<input type="checkbox" id="is_live_'+event_id+'" onclick="onEventLive(this, '+event_id+')"><label for="is_live_'+event_id+'"> Live</label>');
  } else {
    $('#event_live_checkbox_'+event_id).html('<input type="checkbox" id="is_live_'+event_id+'" checked="" onclick="onEventLive(this, '+event_id+')"><label for="is_live_'+event_id+'"> Live</label>');
  }
  var r = confirm("Are you sure you want to perform this action?");
  if (r != true) {
    return false;
  } else {
    $('#event_live_checkbox_'+event_id).prop('disabled', true);
    $.ajax({
      type: "POST",
      url: "/inc-manager/event/"+event_id+"/live",
      dataType: 'json',
      data: JSON.stringify({"is_live": is_live}),
      error: function(resp) {
        $('#event_live_checkbox_'+event_id).prop('disabled', false);
        showAlert(resp.responseJSON.error);
      },
      success: function(resp) {
        $(el).prop('disabled', false);
        if (resp.data.is_live ){
          $('#event_live_checkbox_'+event_id).html('<input type="checkbox" id="is_live_'+event_id+'" checked="" onclick="onEventLive(this, '+event_id+')"><label for="is_live_'+event_id+'"> Live</label>');
          showAlert("Event is now live", true);
        } else {
          $('#event_live_checkbox_'+event_id).html('<input type="checkbox" id="is_live_'+event_id+'" onclick="onEventLive(this, '+event_id+')"><label for="is_live_'+event_id+'"></label>');
          showAlert("Event is no more live", true);
        }
      }
    });
  }
}
// END - EVENT LIVE

// EVENT SELECT TIME
function onEventSelectTime(el, event_id, timeslot_id) {
  $($('#timeslots .select-time-slot.active')).each(function() {
    $(this).removeClass('active');
    $(this).removeAttr('eventid');
    $(this).removeAttr('timeslotid');
  });
  $(el).addClass('active');
  $(el).attr("eventid", event_id);
  $(el).attr("timeslotid", timeslot_id);
  $('#timeslots .time-slot-confirm-btn').removeClass('disabled');
  $('#timeslots .time-slot-confirm-btn').addClass('active');
}

//CloseAccordion on btn click
function onCloseAccordion(){
  $('#timeslots .collapsible-body').hide();
  $('#timeslots .collapsible li').removeClass('active');
  $('#timeslots .collapsible-header').removeClass('active');
}
// END - EVENT SELECT TIME

// EVENT RSVP
function onRsvp(el) {
  var r = confirm("Are you sure, you want to go with this time?");
  if (r != true) {
    return false;
  } else {
    $(el).prop('disabled', true);
    var event_id = $($('#timeslots .select-time-slot.active')).attr("eventid");
    var timeslot_id = $($('#timeslots .select-time-slot.active')).attr("timeslotid");
    $.ajax({
      type: "POST",
      url: "/inc-manager/event/rsvp",
      dataType: 'json',
      data: JSON.stringify({"event_id": event_id, "timeslot_id": timeslot_id}),
      error: function(resp) {
        $(el).prop('disabled', false);
        showAlert(resp.responseJSON.error);
      },
      success: function(resp) {
        window.location.reload();
      }
    });
  }
}
// END - EVENT RSVP

/*==================== END - EVENT/SHOWCASE ====================*/



/*==================== FIELD VALIDATION ====================*/
//Only Integers
function is_number(val) {
  for (var i=0; i<val.length; i++) {
    if( val[i] == '' || isNaN(val[i])) {
      return false;
    }
  }
  return true;
}

//Checking either a text field contains only alphabet and space
function is_alpha_space(val){
  var regexp = /^[a-z A-Z]+$/; 
  for (var i=0; i<val.length; i++) {
    if(val[i] == '' || val[i].match(regexp)) { 
      // valid character
    }else{ 
      return false;
    } 
  }
  return true; 
}

function is_url(val){
  var myRegExp =/^(ht|f)tps?:\/\/[a-z0-9-\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?$/;
  if(val != ""){
    if (!myRegExp.test(val)){
      // alert("Not a valid URL. Pleas folllow like, http://example.com, https://www.example.com");
      return false;
    }else{
      return true;
    }
  }
}
/*==================== END - FIELD VALIDATION ====================*/


//Reply For Comment
$('.replyComment').hide();
function onReplyBtnClick(){
  $('.replyComment').toggle();
}
