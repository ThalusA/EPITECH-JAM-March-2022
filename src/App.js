import logo from './logo.svg';
import './App.css';
import { asyncRun } from "./py-worker";
import { readAsDataURL } from "promise-file-reader";

function App() {
  const converter = fetch("/EPITECH-JAM-March-2022/converter.py").then(response => response.text());

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
          const image_data = await readAsDataURL(file);
          const converter_source = await converter;
          const {results, error} = await asyncRun(converter_source, {
            image_data: image_data.replace("data:image/png;base64,", ""),
          });
          if (error) {
            console.log(error);
          } else {
            const a = document.createElement("a");
            a.href = `data:image/jpeg;base64,${results}`
            a.download = file.name;
            a.click();
          }
        }}/>
      </header>
    </div>
  );
}

export default App;
