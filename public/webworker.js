// webworker.js

// Setup your project to serve `py-worker.js`. You should also serve
// `pyodide.js`, and all its associated `.asm.js`, `.data`, `.json`,
// and `.wasm` files as well:
importScripts("https://cdn.jsdelivr.net/pyodide/v0.19.1/full/pyodide.js");

async function loadPyodideAndPackages() {
  self.pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.19.1/full/",
  });
  await self.pyodide.loadPackage(["Pillow", "numpy"]);
  await self.pyodide.FS.mkdir("/images");
}
const pyodideReadyPromise = loadPyodideAndPackages();
const converterFile = fetch("/converter.py");

self.onmessage = async (event) => {
  // make sure loading is done
  await pyodideReadyPromise;
  // Don't bother yet with this line, suppose our API is built in such a way:
  const { subdata, data, ...context } = event.data;
  const [ id, type, ext ] = subdata;
  // The worker copies the context in its own "memory" (an object mapping name to values)
  for (const key of Object.keys(context)) {
    self[key] = context[key];
  }
  // Now is the easy part, the one that is similar to working in the main thread:
  try {
    let results;
    switch (type) {
      case "convert":
        self.pyodide.FS.writeFile(`/images/image-${id}.${ext}`, data);
        const converterPython = await converterFile;
        await self.pyodide.loadPackagesFromImports(converterPython);
        results = await self.pyodide.runPythonAsync(converterPython, {imageId: id});
        results = self.pyodide.FS.readFile(`/images/image-${id}.${ext}`);
        break;
      default:
        await self.pyodide.loadPackagesFromImports(data);
        results = await self.pyodide.runPythonAsync(data);
        break;
    };
    self.postMessage({ results, id: id });
  } catch (error) {
    self.postMessage({ error: error.message, id: id });
  }
};