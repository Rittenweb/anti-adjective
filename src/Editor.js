import React, { useState } from 'react';
import debounce from './debounce';
import nlp from 'compromise';
import nlpo from 'compromise-output';

export default function Editor() {
  const [terms, setTerms] = useState(localStorage.getItem('text') || '');

  const nlpHtml = nlp.extend(nlpo);

  /*
  let escapedHtml = {
    '<span': 'Greeting',
    'class="adjective">': 'Greeting',
    '</span>': 'Greeting',
  };
  */

  const changeFunction = function (e) {
    let sel = document.getSelection();
    const editorNode = e.target.childNodes[0];
    let offset = sel.anchorOffset;
    let currentNodeStart = 0;

    let anchorNodeNumber;

    for (let i = 0; i < editorNode.childNodes.length; i++) {
      let currentChildTextNode = editorNode.childNodes[i].childNodes[0];

      if (currentChildTextNode === sel.anchorNode) {
        anchorNodeNumber = i;
        break;
      }

      //currentNodeStart += currentChildTextNode.length;
    }

    let words = nlpHtml(e.target.innerText);
    let withMatches = words.html({
      '#Adjective': `adjective`,
    });
    let adjs = words.match('#Adjective');

    const textAddedValue = 31;
    let textAddedNum = 0;

    let insertedIntoCurrentNode = 0;

    /*
    adjs.forEach((match) => {
      let matchIndex =
        match.out('offset')[0].offset.start - textAddedNum * textAddedValue;
      let matchLength = match.out('offset')[0].offset.length;

      if (
        matchIndex > currentNodeStart &&
        matchIndex < currentNodeStart + offset
      ) {
        anchorNodeNumber += 2;
        offset = currentNodeStart + offset - matchIndex - matchLength;
        currentNodeStart = matchIndex + matchLength;
        insertedIntoCurrentNode++;
      }

      textAddedNum++;
      match.prepend('<span class="adjective">');
      match.append('</span>');
    });
    */

    //offset += (insertedIntoCurrentNode - 1) * 2; //not sure why it works but it does...

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

    localStorage.setItem('text', withMatches);
    setTerms(withMatches);

    console.log(editorNode.childNodes[anchorNodeNumber]);
    console.log(editorNode.childNodes[anchorNodeNumber].childNodes[0]);

    let targetTextNode = editorNode.childNodes[anchorNodeNumber].childNodes[0];
    sel.setPosition(targetTextNode, targetTextNode.length - 1);
  };

  const debouncedChangeFunction = debounce(changeFunction, 2000);

  const persistingChangeFunction = function (e) {
    if (
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'Alt'
    ) {
      return;
    } else {
      debouncedChangeFunction(e.nativeEvent);
    }
  };

  const specialCommandsFunction = function (e) {
    /*
    if (e.key === 'Enter') {
      e.preventDefault();
      document.execCommand('insertHTML', false, '<br/>');
    } else if (e.key === 'Alt') {
      //do real stuff.
    }
    */
  };

  const pastePlainText = function (e) {
    e.preventDefault();

    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
  };

  return (
    <div
      contentEditable='true'
      spellCheck='true'
      className='editor'
      onKeyUp={persistingChangeFunction}
      onKeyPress={specialCommandsFunction}
      onPaste={pastePlainText}
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
