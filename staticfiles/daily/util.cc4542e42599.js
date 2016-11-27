var used_emps = [];
function getDeletedRows(tableID) {
  var to_delete = {};
  var deletes = [];
  var rows = $(tableID).find('.danger');
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

function csrfSafeMethod(method) {
      // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function extractList(listId) {
  var vals = []; 
  $(listId).find('li').each(function() {
    if($(this).text() != "") {
      vals.push($(this).text());
    }
  });
  return vals;
}

function configure_delete_button() {
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
}

function configure_undo_button() {
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

function sortable_with_drop(classStr, group, sourceStr, assigned) {
  var initial_parent;
  $("ol.sortable_with_drop" + classStr).sortable({
    group: group,
    onDragStart: function ($item, container, _super) {
      // Duplicate items of the no drop area

      initial_parent = $item.parent();
      var offset = $item.offset(),
    pointer = container.rootGroup.pointer;

  adjustment = {
    left: pointer.left - offset.left,
    top: pointer.top - offset.top
  };

  if(!container.options.drop)
  {
    $item.css('color', 'lightgrey').clone().insertAfter($item);
  }

    _super($item, container);
    
    
  if (container.el.hasClass('all-trash')) {
    $item.remove();
  }
    },

    onDrag: function ($item, position) {
              $item.css({
                left: position.left - adjustment.left,
              top: position.top - adjustment.top
              });
            },

    onDrop: function  ($item, container, _super) {
              console.log(assigned);
              if ((container.el.hasClass('sortable_with_no_drop')) || (container.el.hasClass('trash'))) {
                if(initial_parent.hasClass('sortable_with_no_drop')) {
                  console.log("dragging from sources");
                  var element = $("ol#" + sourceStr).find('li:contains('+ $item.text() + ')').not('.dragged'); 
                  console.log(element);
                  var i;
                    for (i = 0; i < assigned.length; i++)
                    {
                      if(assigned[i] == element.text())  {
                        console.log("is it assigned");
                        element.css('color', 'lightgrey');
                        break;
                      } else {
                        console.log('it is not assigned!');
                        element.css('color', 'black');
                      } 
                    }
                } else {
                  var element = $("ol#" + sourceStr).find('li:contains('+ $item.text() + ')'); 
                    //console.log('is not assigned');
                  //element.css('color', 'black');
                  var index = assigned.indexOf($item.text());   
                  assigned.splice(index, 1);
                  if (assigned.length == 0) {
                    element.css('color', 'black');
                  } else {
                  var i;
                  for (i = 0; i < assigned.length; i++)
                    {
                      if(assigned[i] == element.text())  {
                        console.log("is it assigned");
                        element.css('display', 'none'); 
                        element.css('color', 'lightgrey');
                        break;
                      } 
                        console.log('it is not assigned!');
                        element.css('display', 'inline-block'); 
                        element.css('color', 'black');

                    }
                  }
 
                }
                $item.remove();
              } else {
                used_emps.push($item.text());  
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
}

function sortable_with_no_drop(id, group) {
  $("ol.sortable_with_no_drop" + id).sortable({
    group: group,
    drop: false
  });
}
