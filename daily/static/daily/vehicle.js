function updateVehicles(){
  $('.errors-box').empty();
  $('.errors-box').hide();

  var deletedRows = getDeletedRows('#general-table');
  var jsonList = jsonifyVehicleTable();
  if (jsonList == null) {
    return;
  } else {
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
      url: "/daily/update_vehicle_list",
      data: {deleted: deletedRows, list: jsonList},
      success: function() {
        location = location.pathname + "#saved";
        location.reload();
      }, 
    });
  }
}

function jsonifyVehicleTable() {
  var list = [];
  var errors = [];
  $('#general-table').find('tr.vehicle').each(function(i, e) {
   if($(this).hasClass('danger')) {
    return;
   }
   var vehicle = {};
   var isNew = $(this).hasClass('new');

   $(this).find('td').each(function(j, e) {
    switch(j) {
      case 0:
        vehicle['vehicle-id'] = $(this).text();
        break;
      case 1:
        if (isNew) {
          var newName = $(this).find('input').val();
          //push error message if new name is empty
          if (newName == "") {
            var errorMsg = "name missing for new vehicle";
            console.log(errorMsg);
            errors.push(errorMsg);
          } else {
            //else: simply assign
            vehicle['vehicle-name'] = $(this).find('input').val();
          }
        } else {
            vehicle['vehicle-name'] = $(this).text();
            console.log(vehicle);
        }
        list.push(vehicle);
        break;
    }
   });
  });
  
  if (errors.length > 0) {
    $("#save-button").after($('<div class="errors-box">').text(errors.toString()));
    return null;
  }
  var json_list = JSON.stringify(list);
  return json_list;
}

function addVehicle() {
  $('#general-table > tbody > tr:first-child').after($('<tr class="vehicle new" id="-1">')
      .append($('<td class="id-td">').text("-1"))
      .append($('<td>')
        .append($('<input type="text" id="new-name">')))
      .append($('<td>')
        .append($("<button type='button' class='btn btn-sm btn-danger delete'>")
          .append("delete"))
          .append($("<button type='button' class='btn btn-sm btn-info undo'>")
            .append("Undo!"))));

  $('#new-vehicle-button').toggle();
  $('#new-name').focus();
  configure_delete_button();
  configure_undo_button();
}

$(document).ready(function() {
  $('td.vehicle-name-td').on('click', function() {
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
    }).appendTo($this.empty()).focus();
  });
  
  configure_delete_button();
  configure_undo_button();
});



