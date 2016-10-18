function updatePhones(){
 console.log("update??"); 
  $('.errors-box').empty();
  $('.errors-box').hide();

  var deletedRows = getDeletedRows();
  var jsonList = jsonifyPhoneTable();
  if (jsonList == null) {
    return;
  } else {
    console.log("are we after the jsonList is created");
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

function getDeletedRows() {
  var to_delete = {};
  var deletes = [];
  var rows = $('#daily-table').find('.danger');
  $.each(rows, function(i, val) {
    var id = $(val).attr('id');
    if (id == "-1") {
      return;
    }
    deletes.push(id);
  });
  var deleted_json = JSON.stringify(deletes); 
  return deleted_json;
}

function jsonifyPhoneTable() {
  console.log("jsonify?");
  var list = [];
  var errors = [];
  $('#daily-table').find('tr.phone').each(function(i, e) {
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
          console.log("isNew?");
          var newNumber = $(this).find('input').val();
          //push error message if new name is empty
          if (newNumber == "") {
            var errorMsg = "number missing for new phone";
            console.log(errorMsg);
            errors.push(errorMsg);
          } else {
            console.log("number is there");
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
    console.log("errors?");
    $("#save-button").after($('<div class="errors-box">').text(errors.toString()));
    return null;
  }
  var json_list = JSON.stringify(list);
  return json_list;
}

function addPhone() {
  $('#daily-table > tbody > tr:first-child').after($('<tr class="phone new" id="-1">')
      .append($('<td>').text("-1"))
      .append($('<td>')
        .append($('<input type="text" id="new-number">')))
      .append($('<td>')
        .append($("<button type='button' class='btn btn-sm btn-danger delete'>")
          .append("delete project"))
          .append($("<button type='button' class='btn btn-sm btn-info undo'>")
            .append("Undo!"))));
      


  $('#new-phone-button').toggle();
  $('#new-number').focus();
  $('button.delete').on('click', function() {
    var parents = $(this).parents('tr');
    var target = parents[0];
    var undo = $(target).find('button.undo');
    $(undo).toggle();
    $(this).addClass('hidden-delete');
    $(this).toggle();
    $(undo).css("display", "inline-block");
    $(target).addClass('danger');
    var checkbox = $(target).find('input');
    $(checkbox).attr('disabled', true);
  });

  $('button.undo').on('click', function() {
    var parents = $(this).parents('tr');
    var rightParent = parents[0];
    var redo = $(rightParent).find('button.delete');
    $(redo).toggle();
    $(redo).removeClass('.hidden-delete');
    $(rightParent).removeClass('danger');
    var checkbox = $(rightParent).find('input');
    $(checkbox).attr('disabled', false);
    $(this).toggle();
  });


}

$(document).ready(function() {
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

  $('button.delete').on('click', function() {
    var parents = $(this).parents('tr');
    var target = parents[0];
    var undo = $(target).find('button.undo');
    $(undo).toggle();
    $(this).addClass('hidden-delete');
    $(this).toggle();
    $(undo).css("display", "inline-block");
    $(target).addClass('danger');
    var checkbox = $(target).find('input');
    $(checkbox).attr('disabled', true);
  });

  $('button.undo').on('click', function() {
    var parents = $(this).parents('tr');
    var rightParent = parents[0];
    var redo = $(rightParent).find('button.delete');
    $(redo).toggle();
    $(redo).removeClass('.hidden-delete');
    $(rightParent).removeClass('danger');
    var checkbox = $(rightParent).find('input');
    $(checkbox).attr('disabled', false);
    $(this).toggle();
  });


});


