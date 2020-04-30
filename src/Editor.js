import React, { useState, useRef, useEffect } from 'react';
import debounce from './debounce';
import nlp from 'compromise';
import nlpo from 'compromise-output';
import { fetchAlternatesAdj, fetchAlternatesAdv } from './fetchAlternates';
import tagText from './tagText';
import getNodeOffsetFromBack from './getNodeOffsetFromBack';
import getNewTargetTextNode from './getNewTargetTextNode';
import ColorButtons from './ColorButtons';
import ModeToggler from './ModeToggler';
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
  const nodeOffsetFromBackRef = useRef(1);

  const changeFunction = function (toggling) {
    setMatchSelected(0);
    let selection = document.getSelection();
    const editorNode = document.querySelector('.editor');

    let words = nlpHtml(editorNode.innerText);

    //Get newly-tagged version of current editor content
    let [matchNum, textWithMatches] = tagText(words, toggleMode);

    //Don't rebuild if the matches are unchanged or less than last time
    //But if the event is toggle, need to re-build
    let currentNodeIsAdj =
      selection.anchorNode &&
      selection.anchorNode.parentNode.className === 'adjective';
    if (
      !toggling &&
      !currentNodeIsAdj &&
      matchNum <= matchesRef.current.length
    ) {
      matchesRef.current = [...document.querySelectorAll('.adjective')];
      localStorage.setItem('text', textWithMatches);
      return;
    }

    //Save caret position before editor node refreshes.
    nodeOffsetFromBackRef.current = getNodeOffsetFromBack(selection);

    localStorage.setItem('text', textWithMatches);
    setText(textWithMatches);
  };

  //Call the change function with a toggling flag when toggleMode is changed
  useEffect(() => {
    changeFunction(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleMode]);

  //Whenever the tagged editor content is updated, asynchronously update the
  //reference to current matches and the alternates to those matches as well.
  useEffect(() => {
    //Access the relative node position of the previous caret position and
    //re-calculate it with the new DOM content.
    let targetTextNode = getNewTargetTextNode(nodeOffsetFromBackRef.current);
    let selection = document.getSelection();
    selection.setPosition(targetTextNode, targetTextNode.length);

    matchesRef.current = [...document.querySelectorAll('.adjective')];

    setMatchSelected(0);

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

  //So the parse/rebuild function only runs after the user has
  //stopped typing for at least two seconds.
  const debouncedChangeFunction = debounce(changeFunction, 2000);

  //No need to re-parse if the keystrokes are not inputting characters
  const filteredChangeFunction = function (e) {
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
      debouncedChangeFunction();
    }
  };

  //Tab advances and sets selected match number to then determine sidebar display
  //Alt is the same as clicking the MODE button
  const handleSpecialCommands = function (e) {
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
      setToggleMode(newMode);
    }
  };

  //Contenteditable elements paste with formatting included by default
  const pastePlainText = function (e) {
    e.preventDefault();

    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
  };

  const handleToggle = function (e) {
    let newMode = !toggleMode;
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

  return (
    <div className='app-container'>
      <Sidebar side='left' alternates={nounAlternates} />
      <div className='center'>
        <header className='top-bar'>
          <span>Anti-Adjective</span>
          <span className='instruct'>(press TAB to select ADJ)</span>
          <ColorButtons />
          <ModeToggler mode={toggleMode} handler={handleToggle} />
        </header>
        <main
          contentEditable='true'
          spellCheck='true'
          className='editor'
          onKeyUp={filteredChangeFunction}
          onKeyDown={handleSpecialCommands}
          onPaste={pastePlainText}
          dangerouslySetInnerHTML={{ __html: text }}></main>
      </div>
      <Sidebar side='right' alternates={verbAlternates} />
      <img
        onClick={handleDownload}
        className='download'
        src={require('./download.svg')}
        alt='click here to download .txt file'></img>
    </div>
  );
}
