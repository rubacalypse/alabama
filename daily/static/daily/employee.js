function csrfSafeMethod(method) {
      // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function updateEmployees(){
 console.log("update??"); 
  $('.errors-box').empty();
  $('.errors-box').hide();

  var jsonList = jsonifyEmpTable();
  if (jsonList == null) {
    return;
  } else {
    $('#emps-list').val(jsonList);
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
      url: "/daily/update_employee_list",
      data: {list: jsonList},
      success: function() {
        location.reload();
      }, 
    });
  }
}


function jsonifyEmpTable() {
  console.log("jsonify?");
  var list = [];
  var errors = [];
  $('#daily-table').find('tr.emp').each(function(i, e) {
   var employee = {};
   var isNew = $(this).hasClass('new');

   $(this).find('td').each(function(j, e) {
    switch(j) {
      case 0:
        employee['emp-id'] = $(this).text();
        break;
      case 1:
        if (isNew) {
          console.log("isNew?");
          var newName = $(this).find('input').val();
          //push error message if new name is empty
          if (newName == "") {
            var errorMsg = "name missing for new employee";
            console.log(errorMsg);
            errors.push(errorMsg);
          } else {
            console.log("name is there");
            //else: simply assign
            employee['emp-name'] = $(this).find('input').val();
          }
        } else {
            employee['emp-name'] = $(this).text();
        }
        break;

      case 2:
        employee['emp-cats'] = extractList(this);
        list.push(employee);
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



function addEmployee() {
  $('#daily-table > tbody > tr:first-child').after($('<tr class="emp new">')
      .append($('<td>').text("-1"))
      .append($('<td>')
        .append($('<input type="text" id="new-name">')))
      .append($('<td>')
        .append($("<ol class='sortable_with_drop new-cats' id='new-cats'>"))));

  $('#new-emp-button').toggle();
  $('#new-name').focus();

  $("ol.sortable_with_drop.new-cats").sortable({
    group: 'categories',
    onDragStart: function ($item, container, _super) {
      currentDragID = container.options.dragID;
      var offset = $item.offset(), pointer = container.rootGroup.pointer;

      adjustment = {
        left: pointer.left - offset.left, top: pointer.top - offset.top
      };

      if(!container.options.drop) {
        $item.clone().insertAfter($item);
      }

      _super($item, container);
    },

    onDrag: function ($item, position) {
              $item.css({
                left: position.left - adjustment.left,
              top: position.top - adjustment.top
              });
            },

    onDrop: function  ($item, container, _super) {
              if (container.el.hasClass('trash')) {
                $item.remove();
              } else {
                var $clonedItem = $('<li/>').css({height: 0});
                $item.before($clonedItem);
                $clonedItem.animate({'height': $item.height()});
                $item.animate($clonedItem.position(), function  () {
                  $clonedItem.detach();
                  _super($item, container);
                });
              }
            },
  });

}



$(document).ready(function() {
  $("ol.sortable_with_drop.cat_list").sortable({
    group: 'categories',
    onDragStart: function ($item, container, _super) {
      currentDragID = container.options.dragID;
      var offset = $item.offset(), pointer = container.rootGroup.pointer;

      adjustment = {
        left: pointer.left - offset.left, top: pointer.top - offset.top
      };

      if(!container.options.drop) {
        $item.clone().insertAfter($item);
      }

      _super($item, container);
    },

    onDrag: function ($item, position) {
              $item.css({
                left: position.left - adjustment.left,
              top: position.top - adjustment.top
              });
            },

    onDrop: function  ($item, container, _super) {
              if (container.el.hasClass('trash')) {
                console.log("are you hdfaksdfkaj");
                $item.remove();
              } else {
                var $clonedItem = $('<li/>').css({height: 0});
                $item.before($clonedItem);
                $clonedItem.animate({'height': $item.height()});
                $item.animate($clonedItem.position(), function  () {
                  $clonedItem.detach();
                  _super($item, container);
                });
              }
            },
  });

  $(".category_trash").sortable({
    group: 'categories'
  });

  $("ol.sortable_with_no_drop#cats-source").sortable({
    group: 'categories',
    drop: false
  });


});


