
function saveProject(){
  $('#save-button').toggle();
  $('#save-button').css("display", "inline-block");
  $('#proj-name').val($('#new-name').val());
  $('#proj-time').val($('#new-time').val());
  $('#proj-emps').val(JSON.stringify(extractList('#new-emps')));
  $('#proj-phone').val(JSON.stringify(extractList('#new-phones')));
}

function extractList(listId) {
  var vals = []; 
  $(listId).find('li').each(function() {
    vals.push($(this).text());
  });

  return vals;
}

function addProject() {
  $('#daily-table > tbody > tr:first-child').after($('<tr>')
      .append($('<td>'))
      .append($('<td>')
        .append($('<input type="text" id="new-name">')))
      .append($('<td>')
        .append($('<input type="text" id="new-time" class="time ui-timepicker-input">')))
      .append($('<td>')
        .append($('<div class="container-fluid">')
          .append($("<ol class='sortable_with_drop new-emps' id='new-emps'>"))))
      .append($('<td>')
        .append($('<div class="container-fluid">')
          .append($("<ol class='sortable_with_drop new-phones' id='new-phones'>"))))
      );

  $('#new-proj-button').toggle();
  $('#save-button').toggle();
  $('#new-name').focus();
  $('#new-time').timepicker({
    'step': function(i) {
      return(i%2) ? 15 : 45;
    }
  });

  $("ol.sortable_with_drop.new-emps").sortable({
    group: 'emps-group',
    onDragStart: function ($item, container, _super) {
      // Duplicate items of the no drop area
      console.log("emp drag?");
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
              var $clonedItem = $('<li/>').css({height: 0});
              $item.before($clonedItem);
              $clonedItem.animate({'height': $item.height()});

              $item.animate($clonedItem.position(), function  ()
                  {
                    $clonedItem.detach();
                    _super($item, container);
                  });
            }
  });


  $("ol.sortable_with_drop.new-phones").sortable({
    group: 'phones-group',
    onDragStart: function ($item, container, _super) {
      console.log("phone drag?");
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
      var $clonedItem = $('<li/>').css({height: 0});
      $item.before($clonedItem);
      $clonedItem.animate({'height': $item.height()});
      $item.animate($clonedItem.position(), function  ()
        {
          $clonedItem.detach();
          _super($item, container);
        });
    },
  });
}

$(document).ready(function() {
  $("ol.sortable_with_drop.employee_list").sortable({
    group: 'emps-group',
  onDragStart: function ($item, container, _super) {
    // Duplicate items of the no drop area
    console.log("emp drag?");
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
            var $clonedItem = $('<li/>').css({height: 0});
            $item.before($clonedItem);
            $clonedItem.animate({'height': $item.height()});

            $item.animate($clonedItem.position(), function  ()
                {
                  $clonedItem.detach();
                  _super($item, container);
                });
          }
  });

  $("ol.sortable_with_drop.phone_list").sortable({
    group: 'phones-group',
    onDragStart: function ($item, container, _super) {
      console.log("phone drag?");
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
              var $clonedItem = $('<li/>').css({height: 0});
              $item.before($clonedItem);
              $clonedItem.animate({'height': $item.height()});

              $item.animate($clonedItem.position(), function  ()
                  {
                    $clonedItem.detach();
                    _super($item, container);
                  });
            },
  });


  $("ol.sortable_with_no_drop#emps-source").sortable({
    group: 'emps-group',
    drop: false
  });


  $("ol.sortable_with_no_drop#phones-source").sortable({
    group: 'phones-group',
    drop: false,
  });


});
