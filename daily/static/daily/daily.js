function updateSchedule(){
  $('.errors-box').empty();
  $('.errors-box').hide();
  
  var deletedRows = getDeletedRows('#daily-table');

  var jsonSched = jsonifyTable();
  if (jsonSched == null) {
    return;
  } else {
    $('#schedule').val(jsonSched);
    var csrftoken = $('span.csrf input').val();
    $.ajaxSetup({
      beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
          xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
      }
    });

    $.ajax({
      type: "POST",
      url: "/daily/update_schedule",
      data: {deleted: deletedRows, schedule: jsonSched},
      success: function() {
        location = location.pathname + "#saved";
        location.reload();
      },
    });
  }
}

function login() {
  console.log("whattt");
  var csrftoken = $('span.csrf input').val();
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
                  if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                  }
                }
  });
  
  var username = $('#user-username').val();
  var password = $('#user-password').val();
  console.log(username);
  console.log(password);
  $.ajax({
    type: "POST",
    url: "/daily/login",
    data: {username: username, 
      password: password},
    success: function(request) {
      switch(request.login) {
        case 'valid':
          location = location.pathname + "#valid";
          window.location.reload();
          break;
        case 'invalid':
          console.log(location);
          location = location.pathname + "#invalid";
          window.location.reload();
          break;
      }
    },
  });
}

function jsonifyTable() {
  var schedule = [];
  var errors = [];
  $('#daily-table').find('tr.project').each(function(i, e) {
   //skip projects that are to be deleted 
    if($(this).hasClass('danger')) {
      return;
   }
    var project = {};
   var isNew = $(this).hasClass('new');

   $(this).find('td').each(function(j, e) {
    switch(j) {
      case 0:
        project['proj-id'] = $(this).text();
        break;
      case 1:
        if (isNew) {
          var newName = $(this).find('input').val();
          //push error message if new name is empty
          if (newName == "") {
            var errorMsg = "name missing for new project";
            errors.push(errorMsg);
          } else {
            //else: simply assign
            project['proj-name'] = $(this).find('input').val();
          }
        } else {
            project['proj-name'] = $(this).text();
        }
        break;
      
      case 2:
        project['proj-emps'] = extractList(this);
        break;
      
      case 3:
        if ($(this).find('input').length > 0) {
          var newTime = $(this).find('input').val();
          if (newTime == "") {
            var errorMsg;
            if (project['proj-id'] < 0) {
              errorMsg = "time missing for new project";
            } else {
              errorMsg = "time missing for project " + project['proj-id'];
            }
            errors.push(errorMsg);
          } else {
            project['proj-time'] = $(this).find('input').val();
          }
        } else {
          project['proj-time'] = $(this).text();
        }
        break;

      case 4:
        project['proj-vehicles'] = extractList(this);
        break;

      case 5:
        project['proj-phones'] = extractList(this);
        break;
      
      case 6:
        var complete = $(this).find('.chk-box');
        project['proj-status'] = complete.is(':checked');
        schedule.push(project);
        break;
    }
   });
  });

  if (errors.length > 0) {
    $("#save-button").after($('<div class="errors-box">').text(errors.toString()));
    return null;
  }
  var json_sched = JSON.stringify(schedule);
  return json_sched;
}

function addProject() {
  $('#daily-table > tbody > tr:last-child').after($('<tr class="project new" id="-1">')
      .append($('<td class="proj-id-td">').text("-1"))
      .append($('<td>')
        .append($('<input type="text" id="new-name">')))
      .append($('<td>')
        .append($("<ol class='sortable_with_drop new-emps' id='new-emps'>")))
      .append($('<td>')
        .append($('<input type="text" id="new-time" class="time ui-timepicker-input">')))
      .append($('<td>')
        .append($("<ol class='sortable_with_drop new-vehicles' id='new-vehicles'>")))
      .append($('<td>')
        .append($("<ol class='sortable_with_drop new-phones' id='new-phones'>")))
      .append($('<td>')
        .append($("<div class='checkbox'>")
          .append($("<label>")
            .append($("<input type='checkbox' class='chk-box'>"))))));
      //      .append("completed"))))
     // .append($('<td>')
       // .append($("<button type='button' class='btn btn-sm btn-danger delete'>")
         // .append("cancel project"))
          //.append($("<button type='button' class='btn btn-sm btn-info undo'>")
            //.append("Undo!"))));

  $('#new-proj-button').toggle();
  $('#new-name').focus();
  $('#new-time').timepicker({
    'timeFormat': 'h:i A',
    'minTime': '6:00am',
    'maxTime': '9:00pm',
    'step': function(i) {
      return(i%2) ? 15 : 45;
    }
  });

  sortable_with_drop(".new-emps", "employees");
  sortable_with_drop(".new-phones", "phones");
  sortable_with_drop(".new-vehicles", "vehicles");

  configure_delete_button();
  configure_undo_button();
}

function addTimePicker(td) {
  var time = td.text();
  td.empty();
  td.append($('<input type="text" id="changed-time" class="time ui-timepicker-input" onclick="this.select()" value="' + time + '">'));

  //td.append($('<input type="text" id="changed-time" class="time ui-timepicker-input" >'));
}

$(document).ready(function() {
  if($("#loginflag").val() == 'true') {
    sortable_with_drop(".phone_list", "phones");
    sortable_with_drop(".employee_list", "employees");
    sortable_with_drop(".vehicle_list", "vehicles");

  sortable_with_no_drop("#emps-source", 'employees');
  sortable_with_no_drop("#phones-source", 'phones');
  sortable_with_no_drop("#vehicles-source", 'vehicles');

  $(".phone_trash").sortable({
    group: 'phones'
  });

  $(".employee_trash").sortable({
    group: 'employees'
  });

  $(".vehicle_trash").sortable({
    group: 'vehicles'
  });

  if($(location).attr('hash') == '#saved') {
    $("#date").after("<span>last saved: " + Date().toLocaleString("en-us"));
  }

 
  
  $('td.name-td').on('click', function() {
    var $this = $(this);
    if ($(".new-input").length) {
      return;
    }
    var $input = $('<input>', {
      value: $this.text(),
        type: 'text',
        class: 'new-input',
        blur: function() {
          $this.text(this.value);
        },
        keyup: function(e) {
                 if (e.which === 13) $input.blur();
               }
    }).select().appendTo( $this.empty() ).focus();
  });
  
  $('td.time-td span').on('click', function() {
    var td = $(this).parent();
    addTimePicker(td);
    td.find('input').timepicker({
      'timeFormat': 'h:i A',
      'minTime': '6:00am',
      'maxTime': '9:00pm',
      'step': function(i) {
        return(i%2) ? 15 : 45;
      }
    }).focus();
    td.find('input').trigger('click');
  });

  configure_delete_button();
  configure_undo_button();
}

  
  if($(location).attr('hash') == '#login-invalid') {
    $("#login-form").before("<h5 id='invalid-login-message'>Incorrect login</h5>");
    setTimeout(function() {
      $("a#login-dropdown").trigger('click');
    }, 10);
  }
 
  

});
