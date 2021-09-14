// public/preload.js

const child_process = require("child_process")
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge } = require("electron");

const runCommand = (command) => {
  return child_process.execSync(command).toString().trim()
}

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("api", {
    versions: process.versions,
    runCommand
  });
});