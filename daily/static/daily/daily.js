var newProjectClicked = false;

function updateSchedule(){
  $('#schedule').val(jsonifyTable);
}

function jsonifyTable() {
  var schedule = [];
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
          project['proj-name'] = $(this).find('input').val();
        } else {
          project['proj-name'] = $(this).text();
        }
        break;
      case 2:
        if (isNew) {
          project['proj-time'] = $(this).find('input').val();
        } else {
          project['proj-time'] = $(this).text();
        }
        break;
      case 3:
        project['proj-emps'] = extractList(this);
        break;
      case 4:
        project['proj-phones'] = extractList(this);
        schedule.push(project);
        break;
    }
   });
  });
  var json_sched = JSON.stringify(schedule);
  return json_sched;
}

function extractList(listId) {
  var vals = []; 
  $(listId).find('li').each(function() {
    vals.push($(this).text());
  });

  return vals;
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
        .append($("<ol class='sortable_with_drop new-phones' id='new-phones'>"))));

  $('#new-proj-button').toggle();
 // $('#save-button').toggle();
  $('#new-name').focus();
  $('#new-time').timepicker({
    'step': function(i) {
      return(i%2) ? 15 : 45;
    }
  });

  $("ol.sortable_with_drop.new-emps").sortable({
    group: 'employees',
    onDragStart: function ($item, container, _super) {
      // Duplicate items of the no drop area

      var offset = $item.offset(),
    pointer = container.rootGroup.pointer;

  adjustment = {
    left: pointer.left - offset.left,
    top: pointer.top - offset.top
  };

  if(!container.options.drop)
    $item.clone().insertAfter($item);
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

        $item.animate($clonedItem.position(), function  ()
            {
              $clonedItem.detach();
              _super($item, container);
            });
      } 
            }
  });


  $("ol.sortable_with_drop.new-phones").sortable({
    group: 'phones',
    onDragStart: function ($item, container, _super) {
      // Duplicate items of the no drop area

      var offset = $item.offset(),
    pointer = container.rootGroup.pointer;

  adjustment = {
    left: pointer.left - offset.left,
    top: pointer.top - offset.top
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
      $item.animate($clonedItem.position(), function  ()
        {
          $clonedItem.detach();
          _super($item, container);
        });
      }
            },
  });
}

var currentDragID;
$(document).ready(function() {
  $("ol.sortable_with_drop.phone_list").sortable({
    group: 'phones',
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

  $("ol.sortable_with_drop.employee_list").sortable({
    group: 'employees',

    onDragStart: function ($item, container, _super) {
      currentDragID = container.options.dragID;
      // Duplicate items of the no drop area

      var offset = $item.offset(),
    pointer = container.rootGroup.pointer;

  adjustment = {
    left: pointer.left - offset.left, top: pointer.top - offset.top
  };

  if(!container.options.drop)
    $item.clone().insertAfter($item);
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
                $item.animate($clonedItem.position(), function  ()
                    {
                      $clonedItem.detach();
                      _super($item, container);
                    });
              }
            }
  });

  $(".phone_trash").sortable({
    group: 'phones'
  });

  $(".employee_trash").sortable({
    group: 'employees'
  });

  
  $("ol.sortable_with_no_drop#emps-source").sortable({
    group: 'employees',
    drop: false
  });


  $("ol.sortable_with_no_drop#phones-source").sortable({
    group: 'phones',
    drop: false,
  });

});
