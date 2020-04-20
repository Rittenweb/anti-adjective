import React, { useState } from 'react';
import debounce from './debounce';
import nlp from 'compromise';

export default function Editor() {
  let sent =
    'I walked briskly, swiftly to the store. The happy bird saw me. It was happy and yellow. The end. The end again.';

  let words = nlp(sent);

  let terms = words
    .splitBefore('#Verb #Adverb+')
    .splitAfter('#Verb #Adverb+')
    .splitBefore('#Adverb+ #Verb')
    .splitAfter('#Adverb+ #Verb')
    .splitBefore('#Adjective+ #Noun')
    .splitAfter('#Adjective+ #Noun')
    .out('array');

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
      {terms.map((term, index) =>
        Boolean(nlp(term).match('#Adverb').text()) ||
        Boolean(nlp(term).match('#Adjective+ #Noun').text()) ? (
          <span className='adjective'>{`${term} `}</span>
        ) : (
          <span>{`${term} `}</span>
        )
      )}
    </div>
  );
}
