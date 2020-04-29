import React from 'react';

export default function Sidebar(props) {
  let altsArray = [...props.alternates];
  return (
    <div className={`sidebar sidebar-${props.side}`}>
      {props.alternates.length > 0 && (
        <div className='sidebar-label'>
          {props.side === 'left' ? 'noUns' : 'Verbs'}
        </div>
      )}
      <div className='alternates'>
        {altsArray.map((alternate, index) => {
          return (
            <div className='alternate' key={`${alternate} ${index}`}>
              {alternate}
            </div>
          );
        })}
      </div>
    </div>
  );
}
