// eslint-disable-next-line no-undef
importScripts("https://cdn.jsdelivr.net/pyodide/v0.19.1/full/pyodide.js");

async function loadPyodideAndPackages() {
    self.pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.19.1/full/",
    });
    await self.pyodide.loadPackage(["Pillow", "numpy"]);
}
const pyodideReadyPromise = loadPyodideAndPackages();

self.onmessage = async (event) => {
    await pyodideReadyPromise;
    const { id, python, ...context } = event.data;
    for (const key of Object.keys(context)) {
        self[key] = context[key];
    }
    await self.pyodide.loadPackagesFromImports(python);
    const result = await self.pyodide.runPythonAsync(python)
        .then(results => ({ results, id }))
        .catch(error => ({ error: error.message, id }))
    self.postMessage(result);
};