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

function sortable_with_drop(classStr, group) {
  $("ol.sortable_with_drop" + classStr).sortable({
    group: group,
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
    if ((container.el.hasClass('all-trash')) || (container.el.hasClass('sortable_with_no_drop'))) {
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
}

function sortable_with_no_drop(id, group) {
  $("ol.sortable_with_no_drop" + id).sortable({
    group: group,
    drop: false
  });
}
