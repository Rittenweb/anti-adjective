import React, { useState } from 'react';
import debounce from './debounce';
import nlp from 'compromise';

export default function Editor() {
  const [terms, setTerms] = useState('');

  let escapedHtml = {
    '<span': 'Greeting',
    'class="adjective">': 'Greeting',
    '</span>': 'Greeting',
  };

  const changeFunction = function (e) {
    //first: save innerText to localStorage
    //let range = document.createRange();
    let sel = document.getSelection();
    let anchorNodeNumber;
    const editor = e.target;
    let offset = sel.anchorOffset;
    let currentNodeStart = 0;

    for (let i = 0; i < editor.childNodes.length; i++) {
      let currentChildNode = editor.childNodes[i];
      if (currentChildNode.nodeType !== Node.TEXT_NODE) {
        currentChildNode = currentChildNode.childNodes[0];
      }
      if (currentChildNode === sel.anchorNode) {
        anchorNodeNumber = i;
        break;
      }

      currentNodeStart += currentChildNode.length;
    }

    //get total length of current locationInText
    //get distance back current node reaches from current locationInText
    //if current node is cut off,

    let words = nlp(e.target.innerText, escapedHtml);
    let adjs = words.match('#Adjective');

    const textAddedValue = 31;
    let textAddedNum = 0;

    let insertedIntoCurrentNode = 0;

    adjs.forEach((el) => {
      let elIndex =
        el.out('offset')[0].offset.start - textAddedNum * textAddedValue;
      let elLength = el.out('offset')[0].offset.length;

      if (elIndex > currentNodeStart && elIndex < currentNodeStart + offset) {
        anchorNodeNumber += 2;
        offset = currentNodeStart + offset - elIndex - elLength;
        currentNodeStart = elIndex + elLength; //length of </span>
        insertedIntoCurrentNode++;
      }

      textAddedNum++;
      el.prepend('<span class="adjective">');
      el.append('</span>');
    });

    offset += (insertedIntoCurrentNode - 1) * 2; //not sure why it works but it does...

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

    let newAnchorNode;
    if (editor.hasChildNodes()) {
      if (editor.childNodes[anchorNodeNumber].nodeType !== Node.TEXT_NODE) {
        newAnchorNode = editor.childNodes[anchorNodeNumber].childNodes[0];
      } else {
        newAnchorNode = editor.childNodes[anchorNodeNumber];
      }
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
