import React, { useState, useRef } from 'react';
import debounce from './debounce';
import nlp from 'compromise';
import nlpo from 'compromise-output';
import { fetchAlternatesAdj, fetchAlternatesAdv } from './fetchAlternates';
import tagText from './tagText';
import getNodeOffsetFromBack from './getNodeOffsetFromBack';
import getNewTargetTextNode from './getNewTargetTextNode';
import Sidebar from './Sidebar';

export default function Editor() {
  const nlpHtml = nlp.extend(nlpo);

  const [text, setText] = useState(
    localStorage.getItem('text') || '<pre></pre>'
  );
  const [matchSelected, setMatchSelected] = useState(0);
  const [toggleMode, setToggleMode] = useState(false);
  const [color, setColor] = useState('green');
  const matchesRef = useRef([]);
  const matchAlternatesRef = useRef({});

  const changeFunction = function (e) {
    setMatchSelected(0);
    let sel = document.getSelection();
    const editorNode = document.querySelector('.editor');

    let words = nlpHtml(editorNode.innerText);

    //If this function originated from the toggle button, it's state hasnt' been
    //updated yet. So we have to use the opposite state then uptade it after.
    let targetIsToggleButton = e.target.className === 'toggle';
    let useToggleMode = targetIsToggleButton ? !toggleMode : toggleMode;

    let [matchNum, textWithMatches] = tagText(words, useToggleMode);

    //Don't parse if the matches are unchanged or less than last time
    //But if the event is toggle, need to re-parse
    let currentNodeIsAdj = sel.anchorNode.parentNode.className === 'adjective';
    if (
      !targetIsToggleButton &&
      !currentNodeIsAdj &&
      matchNum <= matchesRef.current.length
    ) {
      matchesRef.current = [...document.querySelectorAll('.adjective')];
      localStorage.setItem('text', textWithMatches);
      return;
    }

    //Save caret position before editor node refreshes.
    let nodeOffsetFromBack = getNodeOffsetFromBack(sel);

    localStorage.setItem('text', textWithMatches);
    setText(textWithMatches);

    //Editor's content refreshed after last line, so re-calculate and reset caret.
    let targetTextNode = getNewTargetTextNode(nodeOffsetFromBack);
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

  const handleToggle = function (e) {
    let newMode = !toggleMode;
    changeFunction(e);
    setToggleMode(newMode);
  };

  const handleGreen = function (e) {
    setColor('green');
  };

  const handleBlue = function (e) {
    setColor('blue');
  };

  const handlePurple = function (e) {
    setColor('purple');
  };

  const handleDownload = function (e) {
    let FileSaver = require('file-saver');
    let editor = document.querySelector('.editor');
    let blob = new Blob([`${editor.innerText}`], {
      type: 'text/plain;charset=utf-8',
    });
    FileSaver.saveAs(blob, 'anti-adj.txt');
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

  console.log('rendered');

  return (
    <header className='App-header'>
      <Sidebar side='left' alternates={nounAlternates} />
      <div className='center'>
        <div className='top-bar'>
          A N T I - A D J E C T I V E
          <div className='color-buttons'>
            <div
              className={
                color === 'green'
                  ? 'color-button color-selected'
                  : 'color-button'
              }
              onClick={handleGreen}></div>
            <div
              className={
                color === 'blue'
                  ? 'color-button color-selected'
                  : 'color-button'
              }
              onClick={handleBlue}></div>
            <div
              className={
                color === 'purple'
                  ? 'color-button color-selected'
                  : 'color-button'
              }
              onClick={handlePurple}></div>
          </div>
          <div className='toggle-container'>
            <span className={toggleMode ? 'off' : 'on'}>
              (adv + vb) / (adj + n)
            </span>
            <div className='toggle' onClick={handleToggle}>
              MODE
            </div>
            <span className={toggleMode ? 'on' : 'off'}>Just (adj)</span>
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
