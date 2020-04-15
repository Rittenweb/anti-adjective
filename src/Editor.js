import React, { useState } from 'react';
import debounce from './debounce';
import nlp from 'compromise';

export default function Editor() {
  let sent = 'Hello. I am me. I am not feeling bad.';

  const [text, setText] = useState('');

  const changeFunction = function (e) {
    setText(e.target.innerText);
  };

  const debouncedChangeFunction = debounce(changeFunction, 2000);

  const persistChangeFunction = function (e) {
    debouncedChangeFunction(e.nativeEvent);
  };

  return (
    <div
      contentEditable='true'
      spellCheck='true'
      className='editor'
      onKeyUp={persistChangeFunction}>
      {sent}
    </div>
  );
}
