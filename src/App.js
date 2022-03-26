import logo from './logo.svg';
import './App.css';
import { asyncRun } from "./py-worker";

function App() {
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
        <input type="file" onChange={async (event) => {
          const file = event.target.files[0];
          const data = await file.arrayBuffer()
          const re = /(?:\.([^.]+))?$/;
          const {results, error} = await asyncRun(data, {}, "convert", re.exec(file.name)[1]);
          if (error) {
            console.log(error);
          } else {
            const blob = new Blob([results]);
            var url = window.URL.createObjectURL(blob);
            window.location.assign(url);
          }
        }}></input>
      </header>
    </div>
  );
}

export default App;
