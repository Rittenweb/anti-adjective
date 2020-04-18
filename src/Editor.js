import React, { useState } from 'react';
import debounce from './debounce';
import nlp from 'compromise';

export default function Editor() {
  let sent =
    'I walked briskly, swiftly to the store. A happy bird saw me. It was happy.';

  let words = nlp(sent);
  words.match('#Verb #Adverb+').forEach((term) => {
    term.prepend('<span>');
    term.append('</span>');
  });
  words.match('#Adverb+ #Verb').forEach((term) => {
    term.prepend('<span>');
    term.append('</span>');
  });
  words.match('#Adjective+ #Noun').forEach((term) => {
    term.prepend('<span>');
    term.append('</span>');
  });
  words.match('#Noun #Adjective+').forEach((term) => {
    term.prepend('<span>');
    term.append('</span>');
  });
  words.match('#Adjective').forEach((term) => {
    term.prepend('<span>');
    term.append('</span>');
  });

  const [text, setText] = useState('');

  const changeFunction = function (e) {
    setText(e.target.innerText);
  };

  const debouncedChangeFunction = debounce(changeFunction, 2000);

  const persistingChangeFunction = function (e) {
    debouncedChangeFunction(e.nativeEvent);
  };

  return (
    <div
      contentEditable='true'
      spellCheck='true'
      className='editor'
      onKeyUp={persistingChangeFunction}>
      <span dangerouslySetInnerHTML={{ __html: words.text() }}></span>
      <span className='adjective'>"The other span"</span>
    </div>
  );
}
