import React from 'react';

export default function ModeToggler(props) {
  return (
    <div className='toggle-container'>
      <span className={props.toggleMode ? 'off' : 'on'}>(adv+vb)/(adj+n)</span>
      <div className='toggle' onClick={props.handler}>
        mode
      </div>
      <span className={props.toggleMode ? 'on' : 'off'}>just (adj)</span>
    </div>
  );
}
