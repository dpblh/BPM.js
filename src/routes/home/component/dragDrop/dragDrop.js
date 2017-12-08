import $ from 'jquery';

function dragged(callback) {
  const droppable = $('.can-dropped');
  this.each(function each() {
    const $this = $(this);
    const body = $(document.body);

    let drag, offsetX, offsetY;
    let moved = false;

    $this.addClass('dragged');

    $this.mousedown(function mousedown(event) {
      drag = $(this).clone();
      const offset = $(this).offset();

      offsetX = event.pageX - offset.left;
      offsetY = event.pageY - offset.top;

      drag.css({
        position: 'absolute',
      });

      body.append(drag);

      function droppableMouseUpHandler(event) {
        if (moved) {
          callback(event, drag);
          moved = false;
        }
      }

      function bodyMouseUpHandler() {
        $this.removeClass('clone-dragged');
        droppable.off('mouseup', droppableMouseUpHandler);
        body.off('mouseup', bodyMouseUpHandler);
        drag.remove();
        drag = null;
      }

      droppable.mouseup(droppableMouseUpHandler);
      body.mouseup(bodyMouseUpHandler);
    });

    function moveAt(event) {
      if (drag) {
        moved = true;
        $this.addClass('clone-dragged');
        drag.addClass('dragging');
        drag.css({
          left: event.pageX - offsetX,
          top: event.pageY - offsetY,
        });
      }
    }

    body.mousemove(moveAt);
  });
}

$.fn.dragged = dragged;
