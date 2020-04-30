import React, { useState } from 'react';
import ColorButton from './ColorButton';

export default function ColorButtons(props) {
  const [color, setColor] = useState('blue');

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

  return (
    <div className='color-buttons'>
      <ColorButton
        color='green'
        selected={color === 'green'}
        handler={handleGreen}
      />
      <ColorButton
        color='blue'
        selected={color === 'blue'}
        handler={handleBlue}
      />
      <ColorButton
        color='purple'
        selected={color === 'purple'}
        handler={handlePurple}
      />
    </div>
  );
}
