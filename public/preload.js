// public/preload.js

const { readdir } = require("fs/promises")
const child_process = require("child_process")
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge } = require("electron");
const shellPath = require('shell-path')

const currentDirectory = () => process.cwd();

const directoryContents = async (path) => {
  const results = await readdir(path, {withFileTypes: true})
  return results.map(entry => ({
    name: entry.name,
    type: entry.isDirectory() ? "directory" : "file",
  }))
}

const runCommand = (command, pathToDir) => {
  return new Promise((resolve, reject) => {
    child_process.exec(command, { cwd: pathToDir }, (error, stdout, stderr) => {
      resolve({stdout, stderr, error})
    })
  })
  // return child_process.execSync(command, { cwd: pathToDir }).toString().trim()
}

const runCommandAdvanced = async ({command, onout, onerr, ondone, pathToDir}) => {
  const injectablePATH = await shellPath()

  const proc = child_process.spawn(
      command,
      [],
      {
        env: {
          PATH: injectablePATH
        },
        cwd: pathToDir,
        shell: true,
        stdio: ["ignore", "pipe", "pipe"],
      },
  )

  proc.stdout.on("data", (data) => {
    console.log(data.toString())
    return onout(data.toString())
  })
  proc.stderr.on("data", (data) => {
    console.log(data.toString())
    return onerr(data.toString())
  })
  proc.on("close", (code) => ondone(code))
}

let sysInfo = {
  os: runCommand("uname -s"),
  cpu: runCommand("uname -m"),
  hostname: runCommand("hostname -s"),
  ip: runCommand("ipconfig getifaddr en0"),
}

const df = () => {
  let output = runCommand("df -kP")
  let rows = output
      .split(/[\r\n]+/)
      .slice(1)
  return rows.map(row => (
      row
          .replace(/\s+(\d+)/g, '\t$1')
          .replace(/\s+\//g, '\t/')
          .split(/\t/)
  ))
}

const showPath = () => {
  return process.env.PATH;
}

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("api", {
    versions: process.versions,
    runCommand,
    runCommandAdvanced,
    sysInfo,
    directoryContents,
    currentDirectory,
    showPath,
    df
  });
});