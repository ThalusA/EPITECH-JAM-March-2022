import "./App.css";
import Pyodide from "./py-worker";
import {readAsDataURL} from "promise-file-reader";
import {useEffect, useRef, useState} from "react";
import {Box, Grid, MenuItem, Select, Typography} from "@mui/material";
import {lightBlue} from "@mui/material/colors";
import ReactAudioPlayer from 'react-audio-player';

function App() {
    const converter = fetch("/EPITECH-JAM-March-2022/converter.py").then(response => response.text());
    const [error, setError] = useState("");
    const [imageData, setImageData] = useState("");
    const [loading, setLoading] = useState(false);
    const base64HeaderRegExp = /^data:image\/[a-zA-Z]+;base64,/;
    const [imageComponent, setImageComponent] = useState(null);
    /**
     * @type {React.MutableRefObject<undefined|HTMLInputElement>}
     */
    const inputFile = useRef(undefined);

    const modes = [
        {value: 'default', label: 'Default'},
        {value: 'blue', label: 'Blue'},
        {value: 'vanisher', label: 'Vanisher'},
    ];
    const [mode, setMode] = useState('default');

    /**
     *
     * @param {FileList | undefined} files
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
                const {results, error} = await Pyodide.asyncRun(converter_source, {
                    image_data,
                    mode
                });
                if (error) {
                    console.error(error);
                    setError("The script encountered an error. Please report DevTools console output to ThalusA#5531");
                } else {
                    setImageData(`data:image/png;base64,${results}`);
                }
            } else {
                setError("The provided file is not an image");
            }
        }
        setLoading(false);
    }

    /**
     * @param {DragEvent<HTMLDivElement>} event
     */
    const onDropFile = (event) => {
        setLoading(true);
        event.preventDefault();
        return convertFile(event.dataTransfer.files);
    };

    /**
     * @param {ChangeEvent<HTMLInputElement>} event
     */
    const onClickFile = (event) => {
        setLoading(true);
        event.preventDefault();
        return convertFile(event.target.files);
    };

    useEffect(() => {
        if (loading === true) {
            setImageComponent(<div className="loading"/>);
        } else if (error !== "") {
            setImageComponent(<Typography>
                Error: {error}
            </Typography>);
        } else if (imageData !== "") {
            setImageComponent(<img src={imageData} style={{borderRadius: "5%", backgroundColor: "white"}} alt="converted"/>);
        } else {
            setImageComponent(null);
        }
    }, [loading, error, imageData]);

    return (
        <Grid onDrop={onDropFile} onClick={() => inputFile.current?.click()}
              className="main-grid"
              container direction="column"
              sx={{
                  minHeight: "100vh", minWidth: "100vw", alignItems: "center", justifyContent: "center",
                  backgroundColor: lightBlue["200"]
              }}>
            <input ref={inputFile} type="file" style={{"display": "none"}} onChange={onClickFile}/>
            <Grid item xs={3}>
                <Typography>
                    Let the blues fulfill your images (click on the page to load your image or drag and drop)
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography>
                    Select your blue mode
                </Typography>
            </Grid>
            <Grid item xs={3}>
                <Box onClick={event => event.stopPropagation()} sx={{overflow: "visible"}}>
                    <Select value={mode} label="Mode" onChange={event => {
                        setMode(event.target.value)
                    }}>
                        {modes.map(({value, label}) => <MenuItem key={label} value={value}>{label}</MenuItem>)}
                    </Select>
                </Box>

            </Grid>
            <Grid item xs={3}>
                {imageComponent}
            </Grid>
            <Grid item xs={3}>
                <ReactAudioPlayer src="/EPITECH-JAM-March-2022/Aqua-Angels.mp3" autoPlay controls />
            </Grid>
        </Grid>
    );
}

export default App;
