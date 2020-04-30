import React from 'react';

export default function ColorButton(props) {
  return (
    <div
      className={
        props.selected
          ? `${props.color} color-button color-selected`
          : `${props.color} color-button`
      }
      onClick={props.handler}></div>
  );
}
