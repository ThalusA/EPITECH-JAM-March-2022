// webworker.js
// eslint-disable-next-line import/no-anonymous-default-export
// eslint-disable-next-line no-restricted-globals

// Setup your project to serve `py-worker.js`. You should also serve
// `pyodide.js`, and all its associated `.asm.js`, `.data`, `.json`,
// and `.wasm` files as well:
importScripts("https://cdn.jsdelivr.net/pyodide/v0.19.1/full/pyodide.js");

async function loadPyodideAndPackages() {
  self.pyodide = await loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.19.1/full/",
  });
  await self.pyodide.loadPackage(["Pillow", "numpy"]);
}
const pyodideReadyPromise = loadPyodideAndPackages();

self.onmessage = async (event) => {
  // make sure loading is done
  await pyodideReadyPromise;
  // Don't bother yet with this line, suppose our API is built in such a way:
  const { id, python, ...context } = event.data;
  // The worker copies the context in its own "memory" (an object mapping name to values)
  for (const key of Object.keys(context)) {
    self[key] = context[key];
  }
  // Now is the easy part, the one that is similar to working in the main thread:
  await self.pyodide.loadPackagesFromImports(python);
  try {
    results = await self.pyodide.runPythonAsync(python);
    self.postMessage({ results, id: id });
  } catch (error) {
    self.postMessage({ error: error.message, id: id });
  }
};