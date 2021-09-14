// public/preload.js

const child_process = require("child_process")
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge } = require("electron");

const runCommand = (command, pathToDir) => {
  return new Promise((resolve, reject) => {
    child_process.exec(command, { cwd: pathToDir }, (error, stdout, stderr) => {
      resolve({stdout, stderr, error})
    })
  })
  // return child_process.execSync(command, { cwd: pathToDir }).toString().trim()
}

let runCommandAdvanced = ({command, onout, onerr, ondone, pathToDir}) => {
  const proc = child_process.spawn(
      command,
      [],
      {
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

function df() {
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

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("api", {
    versions: process.versions,
    runCommand,
    runCommandAdvanced,
    sysInfo,
    df
  });
});