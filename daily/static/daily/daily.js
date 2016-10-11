function updateSchedule(){
  $('.errors-box').empty();
  $('.errors-box').hide();

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
      data: {schedule: jsonSched},
      success: function() {
        location.reload();
      },
    });
  }
}

function jsonifyTable() {
  var schedule = [];
  var errors = [];
  $('#daily-table').find('tr.project').each(function(i, e) {
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
        if (isNew) {
          var newTime = $(this).find('input').val();
          if (newTime == "") {
            var errorMsg = "time missing for new project";
            errors.push(errorMsg);
          } else {
            project['proj-time'] = $(this).find('input').val();
          }
        } else {
          project['proj-time'] = $(this).text();
        }
        break;

      case 3:
        project['proj-emps'] = extractList(this);
        break;
      case 4:
        project['proj-phones'] = extractList(this);
        break;

      case 5:
        project['proj-vehicles'] = extractList(this);
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
  $('#daily-table > tbody > tr:first-child').after($('<tr class="project new">')
      .append($('<td>').text("-1"))
      .append($('<td>')
        .append($('<input type="text" id="new-name">')))
      .append($('<td>')
        .append($('<input type="text" id="new-time" class="time ui-timepicker-input">')))
      .append($('<td>')
        .append($("<ol class='sortable_with_drop new-emps' id='new-emps'>")))
      .append($('<td>')
        .append($("<ol class='sortable_with_drop new-phones' id='new-phones'>")))
      .append($('<td>')
        .append($("<ol class='sortable_with_drop new-vehicles' id='new-vehicles'>"))));

  $('#new-proj-button').toggle();
  $('#new-name').focus();
  $('#new-time').timepicker({
    'step': function(i) {
      return(i%2) ? 15 : 45;
    }
  });


  sortable_with_drop(".new-emps", "employees");
  sortable_with_drop(".new-phones", "phones");
  sortable_with_drop(".new-vehicles", "vehicles");

}

$(document).ready(function() {
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

});
