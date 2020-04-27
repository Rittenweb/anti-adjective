import React, { useState, useRef } from 'react';
import debounce from './debounce';
import nlp from 'compromise';
import nlpo from 'compromise-output';
import { fetchAlternatesAdj, fetchAlternatesAdv } from './fetchAlternates';
import Sidebar from './Sidebar';

export default function Editor() {
  const nlpHtml = nlp.extend(nlpo);

  const [text, setText] = useState(
    localStorage.getItem('text') || '<pre></pre>'
  );
  const [matchSelected, setMatchSelected] = useState(0);
  const [toggleMode, setToggleMode] = useState(false);
  const matchesRef = useRef([]);
  const matchAlternatesRef = useRef({});

  const changeFunction = function (e) {
    setMatchSelected(0);
    let sel = document.getSelection();
    const editorNode = document.querySelector('.editor');

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

    let words = nlpHtml(editorNode.innerText);
    let adjNum = 0;
    let withMatches;

    let targetIsToggleButton = e.target.className === 'toggle';
    let useToggleMode = targetIsToggleButton ? !toggleMode : toggleMode;
    if (useToggleMode) {
      adjNum += words.match('#Adjective').out('array').length;
      withMatches = words.html({
        '#Adjective': `adjective`,
      });
    } else {
      adjNum += words.match('#Verb #Adverb+').out('array').length;
      adjNum += words.match('#Adverb+ #Verb').out('array').length;
      adjNum += words.match('#Adjective+ #Noun').out('array').length;
      withMatches = words.html({
        '#Verb #Adverb+': 'adjective',
        '#Adverb+ #Verb': 'adjective',
        '#Adjective+ #Noun': 'adjective',
      });
    }

    let currentNodeIsAdj = sel.anchorNode.parentNode.className === 'adjective';
    if (
      !targetIsToggleButton &&
      !currentNodeIsAdj &&
      adjNum <= matchesRef.current.length
    ) {
      matchesRef.current = [...document.querySelectorAll('.adjective')];
      localStorage.setItem('text', editorNode.innerText);
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

    if (useToggleMode) {
      matchAlternatesRef.current = fetchAlternatesAdj(
        matchesRef.current,
        matchAlternatesRef.current
      );
    } else {
      matchAlternatesRef.current = fetchAlternatesAdv(
        matchesRef.current,
        matchAlternatesRef.current
      );
    }
  };

  const debouncedChangeFunction = debounce(changeFunction, 2000);

  const persistingChangeFunction = function (e) {
    if (
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'Tab'
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
        sel.selectAllChildren(matchesRef.current[newMatchNumber - 1]);
      }
    }
  };

  const pastePlainText = function (e) {
    e.preventDefault();

    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
  };

  let nounAlternates = '';
  let verbAlternates = '';
  if (matchSelected) {
    let matchText = matchesRef.current[matchSelected - 1].innerText;
    let currentMatchAlternates = matchAlternatesRef.current[matchText];
    if (currentMatchAlternates) {
      nounAlternates = currentMatchAlternates[0];
      verbAlternates = currentMatchAlternates[1];
    }
  }

  const handleToggle = function (e) {
    let newMode = !toggleMode;
    changeFunction(e);
    setToggleMode(newMode);
  };

  const handleDownload = function (e) {
    let FileSaver = require('file-saver');
    let editor = document.querySelector('.editor');
    let blob = new Blob([`${editor.innerText}`], {
      type: 'text/plain;charset=utf-8',
    });
    FileSaver.saveAs(blob, 'anti-adj.txt');
  };

  console.log('rendered');

  return (
    <header className='App-header'>
      <Sidebar side='left' alternates={nounAlternates} />
      <div className='center'>
        <div className='top-bar'>
          A N T I - A D J E C T I V E
          <div className='toggle' onClick={handleToggle}>
            Toggle
          </div>
        </div>
        <div
          contentEditable='true'
          spellCheck='true'
          className='editor'
          onKeyUp={persistingChangeFunction}
          onKeyDown={specialCommandsFunction}
          onPaste={pastePlainText}
          dangerouslySetInnerHTML={{ __html: text }}></div>
      </div>
      <Sidebar side='right' alternates={verbAlternates} />
      <div onClick={handleDownload} className='download'>
        Download Text
      </div>
    </header>
  );
}
