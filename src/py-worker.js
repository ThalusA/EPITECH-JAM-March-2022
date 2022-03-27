
class WorkerBuilder {

  constructor() {
    this.id = 0;
    this.callbacks = {};
    this.worker = new Worker("/EPITECH-JAM-March-2022/pyodide.worker.js");
    this.worker.onmessage = (event) => {
      const { id, ...data } = event.data;
      const onSuccess = this.callbacks[id];
      delete this.callbacks[id];
      onSuccess(data);
    };
  }

  asyncRun(python, context) {
    // the id could be generated more carefully
    this.id = (this.id + 1) % Number.MAX_SAFE_INTEGER;
    return new Promise((onSuccess) => {
      this.callbacks[this.id] = onSuccess;
      this.worker.postMessage({
        ...context,
        python,
        id: this.id,
      });
    });
  };
}

const Pyodide = new WorkerBuilder();

export default Pyodide;