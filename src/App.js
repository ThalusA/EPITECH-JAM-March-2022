import './App.css';
import { asyncRun } from "./py-worker";
import { readAsDataURL } from "promise-file-reader";
import {useRef, useState} from "react";
// eslint-disable-next-line no-unused-vars
import Select, {PropsValue} from 'react-select'


function App() {
  const converter = fetch("/EPITECH-JAM-March-2022/converter.py").then(response => response.text());
  const [error, setError] = useState("");
  const [imageData, setImageData] = useState("");
  const base64HeaderRegExp = /^data:image\/[a-zA-Z]+;base64,/;
  /**
   * @type {React.MutableRefObject<undefined|HTMLInputElement>}
   */
  const inputFile = useRef(undefined);
  const modeSelector = useRef(undefined);

  /**
   * @type {Array<PropsValue>}
   */
  const modes = [
    {value: 'default', label:'Default'},
    {value: 'blue', label:'Blue'},
  ];
  const [mode, setMode] = useState('default');

  /**
   *
   * @param {FileList} files
   * @returns {Promise<void>}
   */
  async function convertFile(files) {
    if (files === undefined) {
      setError("You did not drag and drop any image");
    } else if (files.length !== 1) {
      setError("Do not drag and drop multiple images");
    } else {
      const file = files[0];
      const file_data = await readAsDataURL(file);
      if (base64HeaderRegExp.test(file_data)) {
        const converter_source = await converter;
        const image_data = file_data.replace(base64HeaderRegExp, "");
        const {results, error} = await asyncRun(converter_source, {
          image_data: image_data,
          mode
        });
        if (error) {
          console.error(error);
          setError("The script encountered an error. Please report DevTools console output to ThalusA#5531");
        } else {
          setImageData(`data:image/jpeg;base64,${results}`);
        }
      } else {
        setError("The provided file is not an image");
      }
    }
  }

  /**
   * @param {DragEvent<HTMLDivElement>} event
   */
  const onDropFile = (event) => {
    event.preventDefault();
    return convertFile(event.dataTransfer.files);
  };

  /**
   * @param {ChangeEvent<HTMLInputElement>} event
   */
  const onClickFile = (event) => {
    event.preventDefault();
    return convertFile(event.target.files);
  };

  return (
    <div className="App" onDrop={onDropFile} onClick={() => inputFile.current?.click()} style={{"z-index": 10}}>
      <input ref={inputFile} type="file" style={{"display": "none"}} onChange={onClickFile} />
      <header className="App-header">
        <p>
          Let the blues fulfill your images (click on the page to load your image or drag and drop)
        </p>
        <p>
          Select your blue mode
          <Select ref={modeSelector} options={modes} defaultValue={modes[0]} style={{"z-index": 20}} onChange={event => setMode(event.value)}/>
        </p>
      </header>
      <main>
        {imageData !== "" ? <img src={imageData}  alt="converted"/> : null}
      </main>
      <footer>
        {error !== "" ? <p>
          {error}
        </p> : null}
      </footer>
    </div>
  );
}

export default App;
