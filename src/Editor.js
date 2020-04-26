import React, { useState, useEffect, useRef } from 'react';
import debounce from './debounce';
import nlp from 'compromise';
import nlpo from 'compromise-output';
import Sidebar from './Sidebar';

export default function Editor() {
  const nlpHtml = nlp.extend(nlpo);

  const [text, setText] = useState(
    localStorage.getItem('text') || '<pre></pre>'
  );
  const [matchSelected, setMatchSelected] = useState(0);
  const matchesRef = useRef([]);
  const matchAlternatesRef = useRef([]);

  useEffect(() => {
    matchesRef.current.forEach((match) => {
      let alternatesArr = [];
      fetch(`https://api.datamuse.com/words?rel_jja=${match.innerText}`, {
        cache: 'no-cache',
      })
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          let nounsArr = [];
          data.forEach((alternate) => {
            nounsArr.push(alternate.word);
          });
          alternatesArr.push(nounsArr);
          return fetch(`https://api.datamuse.com/words?ml=${match.innerText}`);
        })
        .then((data) => {
          return data.json();
        })
        .then((data) => {
          let verbsArr = [];
          data.forEach((alternate) => {
            if (alternate.tags.includes('v')) {
              let lexicon = {};
              lexicon[`${alternate.word}`] = 'Verb';
              let infinitive = nlp(alternate.word, lexicon)
                .verbs()
                .toInfinitive()
                .text();
              verbsArr.push(infinitive ? infinitive : alternate.word);
            }
          });
          alternatesArr.push(verbsArr);
          matchAlternatesRef.current.push(alternatesArr);
        });
    });
  }, []);

  console.log(matchAlternatesRef);

  const changeFunction = function (e) {
    setMatchSelected(0);
    let sel = document.getSelection();
    const editorNode = e.target;

    let words = nlpHtml(editorNode.innerText);
    let adjNum = words.match('#Adjective').out('array').length;
    let withMatches = words.html({
      '#Adjective': `adjective`,
    });

    if (adjNum <= matchesRef.current.length) {
      matchesRef.current = [...document.querySelectorAll('.adjective')];
      localStorage.setItem('text', withMatches);
      return;
    }

    let nodeOffsetFromBack;

    let preNodeChildren = [];

    for (let i = 0; i < editorNode.childNodes.length; i++) {
      preNodeChildren = preNodeChildren.concat(
        ...editorNode.childNodes[i].childNodes
      );
    }

    for (let i = preNodeChildren.length - 1; i >= 0; i--) {
      let currentChildTextNode = preNodeChildren[i].childNodes[0];

      if (currentChildTextNode === sel.anchorNode) {
        nodeOffsetFromBack = preNodeChildren.length - i;
        break;
      }
    }

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
    setText(withMatches);

    let newPreNodeChildren = editorNode.childNodes[0].childNodes;
    let newPreNodeChildrenLength = newPreNodeChildren.length;

    if (nodeOffsetFromBack > newPreNodeChildrenLength) {
      nodeOffsetFromBack = newPreNodeChildrenLength;
    }

    if (typeof nodeOffsetFromBack !== 'number') {
      nodeOffsetFromBack = 1;
    }

    let targetTextNode =
      newPreNodeChildren[newPreNodeChildrenLength - nodeOffsetFromBack]
        .childNodes[0];
    sel.setPosition(targetTextNode, targetTextNode.length);

    matchesRef.current = [...document.querySelectorAll('.adjective')];

    setMatchSelected(0);
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
    if (e.key === 'Tab') {
      e.preventDefault();
      if (matchesRef.current.length) {
        let newMatchNumber;
        if (matchSelected === 0 || matchSelected === 1) {
          newMatchNumber = matchesRef.current.length;
        } else {
          newMatchNumber = matchSelected - 1;
        }
        setMatchSelected(newMatchNumber);
        let sel = document.getSelection();
        sel.selectAllChildren(matchesRef.current[newMatchNumber - 1]); //-1 because matchSelected is stored is one greater than index in matches
      }
    }
  };

  const pastePlainText = function (e) {
    e.preventDefault();

    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
  };

  console.log(matchAlternatesRef.current);
  console.log('rendered');

  return (
    <header className='App-header'>
      <Sidebar
        side='left'
        alternates={
          matchSelected ? matchAlternatesRef.current[matchSelected][0] : ''
        }
      />
      <div className='center'>
        <div className='top-bar'>A N T I - A D J E C T I V E</div>
        <div
          contentEditable='true'
          spellCheck='true'
          className='editor'
          onKeyUp={persistingChangeFunction}
          onKeyDown={specialCommandsFunction}
          onPaste={pastePlainText}
          dangerouslySetInnerHTML={{ __html: text }}></div>
      </div>
      <Sidebar
        side='right'
        alternates={
          matchSelected ? matchAlternatesRef.current[matchSelected][1] : ''
        }
      />
    </header>
  );
}
