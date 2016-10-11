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
}

function sortable_with_no_drop(id, group) {
  $("ol.sortable_with_no_drop" + id).sortable({
    group: group,
    drop: false
  });
}
