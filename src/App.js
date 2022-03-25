import logo from './logo.svg';
import './App.css';
import { asyncRun } from "./py-worker";

function App() {

  const script = `
      import statistics
      from js import A_rank
      statistics.stdev(A_rank)
  `;

  const context = {
    A_rank: [0.8, 0.4, 1.2, 3.7, 2.6, 5.8],
  };

  async function main() {
    try {
      const { results, error } = await asyncRun(script, context);
      if (results) {
        console.log("pyodideWorker return results: ", results);
      } else if (error) {
        console.log("pyodideWorker error: ", error);
      }
    } catch (e) {
      console.log(
        `Error in pyodideWorker at ${e.filename}, Line: ${e.lineno}, ${e.message}`
      );
    }
  }

  main();

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
      </header>
    </div>
  );
}

export default App;
