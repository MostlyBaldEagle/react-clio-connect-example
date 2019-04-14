import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { APIService } from './services/api.service';

class App extends Component {

  onclick(event) {
    console.log("onclick:", event)
    APIService.authenticateWithClio().then((response) => {
      console.log("response:",response)
    }, (error) => {
      console.log("error:", error)
    });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button onClick={this.onclick}>connect to clio</button>
        </header>
      </div>
    );
  }
}

export default App;
