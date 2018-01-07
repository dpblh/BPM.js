import React, { Component } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import $ from 'jquery';
import s from './DraggableButton.css';

class DragableButton extends Component {
  componentDidMount() {
    const { callback } = this.props;
    const droppable = $('.can-dropped');
    const $this = $(this.element);
    const body = $(document.body);

    let drag, offsetX, offsetY;
    let moved = false;

    $this.addClass(s.dragged);

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
        $this.removeClass(s.cloneDragged);
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
        $this.addClass(s.cloneDragged);
        drag.addClass(s.dragging);
        drag.css({
          left: event.pageX - offsetX,
          top: event.pageY - offsetY,
        });
      }
    }

    body.mousemove(moveAt);
  }

  render() {
    const { callback, ...props } = this.props;
    return <div {...props} ref={el => (this.element = el)} />;
  }
}

export default withStyles(s)(DragableButton);
