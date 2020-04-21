import React, { useState } from 'react';
import debounce from './debounce';
import nlp from 'compromise';

export default function Editor() {
  const [terms, setTerms] = useState('');
  const [caretPosition, setCaretPosition] = useState(0);

  const changeFunction = function (e) {
    //first: save innerText to localStorage
    //let range = document.createRange();
    let sel = document.getSelection();
    let anchorNodeNumber;
    const editor = e.target;
    for (let i = 0; i < editor.childNodes.length; i++) {
      let currentChildNode = editor.childNodes[i];
      if (currentChildNode.nodeType !== Node.TEXT_NODE) {
        currentChildNode = currentChildNode.childNodes[0];
      }
      if (currentChildNode === sel.anchorNode) {
        anchorNodeNumber = i;
        break;
      }
    }
    console.log('anchor number' + anchorNodeNumber);
    let offset = sel.anchorOffset;
    let words = nlp(e.target.innerText);
    let adjs = words.match('#Adjective');
    adjs.forEach((el) => {
      el.prepend('<span class="adjective">');
      el.append('</span>');
    });
    /*
    let newTerms = words
      .splitBefore('#Verb #Adverb+')
      .splitAfter('#Verb #Adverb+')
      .splitBefore('#Adverb+ #Verb')
      .splitAfter('#Adverb+ #Verb')
      .splitBefore('#Adjective+ #Noun')
      .splitAfter('#Adjective+ #Noun')
      .out('array');
    e.target.innerText = '';
    */
    setTerms(words.text());
    /*
    range.setStart(e.target, 1);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    */
    let newAnchorNode;
    if (editor.childNodes[anchorNodeNumber].nodeType !== Node.TEXT_NODE) {
      newAnchorNode = editor.childNodes[anchorNodeNumber].childNodes[0];
    } else {
      newAnchorNode = editor.childNodes[anchorNodeNumber];
    }
    sel.setPosition(newAnchorNode, offset);
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
      onKeyUp={persistingChangeFunction}
      dangerouslySetInnerHTML={{ __html: terms }}>
      {/* {terms.map((term, index) =>
        Boolean(nlp(term).match('#Verb #Adverb+').text()) ||
        Boolean(nlp(term).match('#Adverb+ #Verb').text()) ||
        Boolean(nlp(term).match('#Adjective+ #Noun').text()) ? (
          <span className='adjective'>{`${term} `}</span>
        ) : (
          <span>{`${term} `}</span>
        )
      )} */}
    </div>
  );
}
