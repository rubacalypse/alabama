function updatePhones() {
  $('.errors-box').empty();
  $('.errors-box').hide();

  var deletedRows = getDeletedRows('#general-table');
  var jsonList = jsonifyPhoneTable();
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
      url: "/daily/update_phone_list",
      data: {deleted: deletedRows, list: jsonList},
      success: function() {
        location = location.pathname + "#saved";
        location.reload();
      }, 
    });
  }
}


function jsonifyPhoneTable() {
  var list = [];
  var errors = [];
  $('#general-table').find('tr.phone').each(function(i, e) {
   if($(this).hasClass('danger')) {
    return;
   }
   var phone = {};
   var isNew = $(this).hasClass('new');

   $(this).find('td').each(function(j, e) {
    switch(j) {
      case 0:
        phone['phone-id'] = $(this).text();
        break;
      case 1:
        if (isNew) {
          var newNumber = $(this).find('input').val();
          //push error message if new name is empty
          if (newNumber == "") {
            var errorMsg = "number missing for new phone";
            console.log(errorMsg);
            errors.push(errorMsg);
          } else {
            //else: simply assign
            phone['phone-number'] = $(this).find('input').val();
          }
        } else {
            phone['phone-number'] = $(this).text();
            console.log(phone);
        }
        list.push(phone);
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

function addPhone() {
  $('#general-table > tbody > tr:first-child').after($('<tr class="phone new" id="-1">')
      .append($('<td class="id-td">').text("-1"))
      .append($('<td>')
        .append($('<input type="text" class="text-input" id="new-number">')))
      .append($('<td>')
        .append($("<button type='button' class='btn btn-sm btn-danger delete'>")
          .append("delete"))
          .append($("<button type='button' class='btn btn-sm btn-info undo'>")
            .append("Undo!"))));
      


  $('#new-phone-button').toggle();
  $('#new-number').focus();
  configure_delete_button();
  configure_undo_button(); 
}

$(document).ready(function() {
  if($("#loginflag").val() == 'true') {
  $('td.phone-number-td').on('click', function() {
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
  }
});


