import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  /*
    https://api.wordassociations.net/associations/v1.0/json/search?
    apikey=<API key>
    & text=<word or phrase>
    & lang=<language>
    & [type=<result type>]
    & [limit=<maximum number of results>]
    & [pos=<parts of speech>]
    & [indent=<yes or no>]
  */

  let [resp, setResp] = useState('');

  /*fetch(
    `https://api.wordassociations.net/associations/v1.0/json/search?
    apikey=2f06934d-533f-4380-943c-460ce962753e
    &text=cloudy
    &lang=en
    &type=stimulus
    &limit=10
    &pos=noun,verb
    &indent=yes`,
    {
      mode: 'no-cors',,
    }
  ) */

  useEffect(() => {
    fetch(`https://api.datamuse.com/words?rel_jja=yellow`, {
      cache: 'no-cache',
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        console.log(data);
        setResp(data.toString());
      });
  });

  return (
    <div className='App'>
      <header className='App-header'>
        <div contentEditable='true' spellCheck='true' className='editor'>
          {resp}
        </div>
      </header>
    </div>
  );
}

export default App;
