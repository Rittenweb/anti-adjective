import React from 'react';

export default function Sidebar(props) {
  return (
    <div className={`sidebar sidebar-${props.side}`}>{props.alternates} </div>
  );
}
