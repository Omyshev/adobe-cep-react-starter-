import React from "react";
import logo from './logo.svg';
const App = () => {

  return (
    <div className="App">
      
      <header className="App-header">
      <img src={logo} className="main_logo" alt="logo" />
        <p>
          Edit <code>src/App.</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
};

export default App;
