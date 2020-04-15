import React, { useState } from 'react';

export default function Editor() {
  let sent = 'Hello. I am me. I am not feeling bad.';

  const [text, setText] = useState('');

  const changeFunction = function (e) {
    setText(e.target.innerText);
  };

  return (
    <div
      contentEditable='true'
      spellCheck='true'
      className='editor'
      onKeyUp={changeFunction}>
      {sent}
    </div>
  );
}
