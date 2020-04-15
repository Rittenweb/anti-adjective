import React, { useState, useEffect } from 'react';
import './App.css';
import nlp from 'compromise';
import Editor from './Editor';

/*
 WORD ASSOCIATIONS API: NOT WORKING

  fetch(
   `https://api.wordassociations.net/associations/v1.0/json/search?
   apikey=2f06934d-533f-4380-943c-460ce962753e
   &text=cloudy
   &lang=en
   &type=stimulus
   &limit=10
   &pos=noun,verb
   &indent=yes`
 ) 

 https://wordassociations.net/en/api-doc

 

 DATAMUSE API: WORKING

 One adj: get nouns:
 "rel_jja"
 Nouns often described with the adj 'yellow'
 From https://api.datamuse.com/words?rel_jja=yellow
   [
    {"word":"fever","score":1001},
    {"word":"color","score":1000},
    {"word":"flowers","score":999},
    {"word":"light","score":998},
    {"word":"color","score":997}
    Better ones further down...
   ]

  One adj: get verbs:
  "ml"
  Words with similar meaning to 'happy'
  From https://api.datamuse.com/words?ml=happy
  [
    {"word":"glad","score":120312,"tags":["syn","adj"]},
    {"word":"pleased","score":117678,"tags":["syn","adj"]},
    {"word":"fortunate","score":113299,"tags":["syn","adj"]},
    {"word":"contented","score":111722,"tags":["syn","adj","v"]},
    {"word":"blessed","score":110975,"tags":["syn","adj","prop"]},
    Verbs are further down...
  ]


  (Adj + Noun) OR (Adv + verb):
  "ml"
  Words with similar meaning to 'slowly walk'
  From https://api.datamuse.com/words?ml=slowly+walk
  [
    {"word":"plod","score":49655,"tags":["syn","v"]},
    {"word":"amble","score":48855,"tags":["syn","v","n"]},
    {"word":"mosey","score":48455,"tags":["syn","v"]},
    {"word":"pace","score":29255,"tags":["n"]},
    {"word":"ambling","score":28455,"tags":["v"]},
    {"word":"dawdle","score":28455,"tags":["v"]},
    {"word":"lag","score":28455,"tags":["n"]},
    {"word":"shack","score":28455,"tags":["n"]},
    {"word":"stalk","score":28455,"tags":["n"]}
 
 */

function App() {
  /*useEffect(() => {
    fetch(`https://api.datamuse.com/words?ml=happy`, {
      cache: 'no-cache',
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setResp(JSON.stringify(data));
      });
  }, []);
  */

  return (
    <div className='App'>
      <header className='App-header'>
        <div className='top-bar'>A N T I - A D J E C T I V E</div>
        <Editor />
      </header>
    </div>
  );
}

export default App;
