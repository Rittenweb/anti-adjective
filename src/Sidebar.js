import React from 'react';

export default function Sidebar(props) {
  let altsArray = [...props.alternates];
  return (
    <div className={`sidebar sidebar-${props.side}`}>
      {altsArray.map((alternate, index) => {
        return (
          <div className='alternate' key={`${alternate} ${index}`}>
            {alternate}
          </div>
        );
      })}
    </div>
  );
}
