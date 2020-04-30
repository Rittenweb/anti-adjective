import React from 'react';

export default function ModeToggler(props) {
  return (
    <div className='toggle-container'>
      <span className={props.mode ? 'off' : 'on'}>(adv+vb)/(adj+n)</span>
      <div className='toggle' onClick={props.handler}>
        mode
      </div>
      <span className={props.mode ? 'on' : 'off'}>just (adj)</span>
    </div>
  );
}
