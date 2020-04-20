import React, { useState } from 'react';
import debounce from './debounce';
import nlp from 'compromise';

export default function Editor() {
  let sent =
    'I walked briskly, swiftly to the store. The happy bird saw me. It was happy.';

  let words = nlp(sent);

  let terms = [];

  words.match('#Verb #Adverb+').forEach((term) => {
    terms.push(term.text());
    term.prepend(`<span class="adjective" dataset-index=${terms.length - 1}>`);
    term.append('</span>');
  });
  words.match('#Adverb+ #Verb').forEach((term) => {
    terms.push(term.text());
    term.prepend(`<span class="adjective" dataset-index=${terms.length - 1}>`);
    term.append('</span>');
  });
  words.match('#Adjective+ #Noun').forEach((term) => {
    terms.push(term.text());
    term.prepend(`<span class="adjective" dataset-index=${terms.length - 1}>`);
    term.append('</span>');
  });

  words.match('#Adjective').forEach((term) => {
    terms.push(term.text());
    term.prepend(`<span class="adjective" dataset-index=${terms.length - 1}>`);
    term.append('</span>');
  });

  console.log(terms);

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
    </div>
  );
}
