import React from 'react';
import './App.css';
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
 */

function App() {
  return (
    <div className='App'>
      <Editor />
    </div>
  );
}

export default App;
