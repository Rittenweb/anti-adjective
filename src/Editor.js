import React, { useState, useRef, useEffect } from 'react';
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
  const [color, setColor] = useState('blue');
  const matchesRef = useRef([]);
  const matchAlternatesRef = useRef({});
  const nodeOffsetFromBackRef = useRef(0);

  const changeFunction = function (toggling) {
    setMatchSelected(0);
    let sel = document.getSelection();
    const editorNode = document.querySelector('.editor');

    let words = nlpHtml(editorNode.innerText);

    let [matchNum, textWithMatches] = tagText(words, toggleMode);

    let targetIsToggleButton = toggling;

    //Don't rebuild if the matches are unchanged or less than last time
    //But if the event is toggle, need to re-build
    let currentNodeIsAdj =
      sel.anchorNode && sel.anchorNode.parentNode.className === 'adjective';
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
    nodeOffsetFromBackRef.current = getNodeOffsetFromBack(sel);

    localStorage.setItem('text', textWithMatches);
    setText(textWithMatches);
  };

  //Call the change function with a toggling flag when toggleMode is changed
  useEffect(() => {
    changeFunction(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleMode]);

  useEffect(() => {
    let targetTextNode = getNewTargetTextNode(nodeOffsetFromBackRef.current);
    let sel = document.getSelection();
    sel.setPosition(targetTextNode, targetTextNode.length);

    matchesRef.current = [...document.querySelectorAll('.adjective')];

    setMatchSelected(0);

    console.log('called');
    if (toggleMode) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const debouncedChangeFunction = debounce(changeFunction, 2000);

  const persistingChangeFunction = function (e) {
    if (
      e.key === 'ArrowLeft' ||
      e.key === 'ArrowRight' ||
      e.key === 'ArrowUp' ||
      e.key === 'ArrowDown' ||
      e.key === 'Tab' ||
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
        sel.selectAllChildren(matchesRef.current[newMatchNumber - 1]);
      }
    } else if (e.key === 'Alt') {
      e.preventDefault();
      let newMode = !toggleMode;
      changeFunction(e);
      setToggleMode(newMode);
    }
  };

  const pastePlainText = function (e) {
    e.preventDefault();

    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
  };

  const handleToggle = function (e) {
    let newMode = !toggleMode;
    setToggleMode(newMode);
  };

  const handleGreen = function (e) {
    document.documentElement.style.setProperty(`--color-lightest`, '#009888');
    document.documentElement.style.setProperty(`--color-lighter`, '#007B6E');
    document.documentElement.style.setProperty(`--color-darker`, '#004840');
    document.documentElement.style.setProperty(`--color-darkest`, '#002421');
    setColor('green');
  };

  const handleBlue = function (e) {
    document.documentElement.style.setProperty(`--color-lightest`, '#0b4edd');
    document.documentElement.style.setProperty(`--color-lighter`, '#0b399a');
    document.documentElement.style.setProperty(`--color-darker`, '#072054');
    document.documentElement.style.setProperty(`--color-darkest`, '#020c22');
    setColor('blue');
  };

  const handlePurple = function (e) {
    document.documentElement.style.setProperty(`--color-lightest`, '#9a76dc');
    document.documentElement.style.setProperty(`--color-lighter`, '#7a61aa');
    document.documentElement.style.setProperty(`--color-darker`, '#302641');
    document.documentElement.style.setProperty(`--color-darkest`, '#120e1a');
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
    <div className='app-container'>
      <Sidebar side='left' alternates={nounAlternates} />
      <div className='center'>
        <header className='top-bar'>
          <span>Anti-Adjective</span>
          <span className='instruct'>(press TAB to select ADJ)</span>
          <div className='color-buttons'>
            <div
              className={
                color === 'green'
                  ? 'green color-button color-selected'
                  : 'green color-button'
              }
              onClick={handleGreen}></div>
            <div
              className={
                color === 'blue'
                  ? 'blue color-button color-selected'
                  : 'blue color-button'
              }
              onClick={handleBlue}></div>
            <div
              className={
                color === 'purple'
                  ? 'purple color-button color-selected'
                  : 'purple color-button'
              }
              onClick={handlePurple}></div>
          </div>
          <div className='toggle-container'>
            <span className={toggleMode ? 'off' : 'on'}>(adv+vb)/(adj+n)</span>
            <div className='toggle' onClick={handleToggle}>
              mode
            </div>
            <span className={toggleMode ? 'on' : 'off'}>just (adj)</span>
          </div>
        </header>
        <main
          contentEditable='true'
          spellCheck='true'
          className='editor'
          onKeyUp={persistingChangeFunction}
          onKeyDown={specialCommandsFunction}
          onPaste={pastePlainText}
          dangerouslySetInnerHTML={{ __html: text }}></main>
      </div>
      <Sidebar side='right' alternates={verbAlternates} />
      <img
        onClick={handleDownload}
        className='download'
        src={require('./download.svg')}
        alt='click here to download'></img>
    </div>
  );
}
