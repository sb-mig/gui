// public/preload.js
const { readdir, readlink, stat } = require("fs/promises")
const child_process = require("child_process")
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");
const shellPath = require('shell-path')
const path = require("path")

const currentDirectory = () => process.cwd();

const fileInfo = async (basePath, entry) => {
  const {name} = entry
  const fullPath = path.join(basePath, name)
  let linkTarget = null
  let fileStat

  if (entry.isSymbolicLink()) {
    linkTarget = await readlink(fullPath)
  }

  // This most commonly happens with broken symlinks
  // but could also happen if the file is deleted
  // while we're checking it as race condition
  try {
    fileStat = await stat(fullPath)
  } catch {
    return {
      name,
      type: "broken",
      linkTarget,
    }
  }

  let {size, mtime} = fileStat

  if (fileStat.isDirectory()) {
    return {
      name,
      type: "directory",
      mtime,
      linkTarget,
    }
  } else if (fileStat.isFile()) {
    return {
      name,
      linkTarget,
      type: "file",
      size,
      mtime,
    }
  } else {
    return {
      name,
      type: "special",
    }
  }
}

const directoryContents = async (path) => {
  const results = await readdir(path, {withFileTypes: true})
  return await Promise.all(results.map(entry => fileInfo(path, entry)))
}

const runCommand = (command, pathToDir) => {
  return new Promise((resolve, reject) => {
    child_process.exec(command, { cwd: pathToDir }, (error, stdout, stderr) => {
      resolve({stdout, stderr, error})
    })
  })
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

const workingDirectory = ipcRenderer.invoke('getStoreValue', 'workingDirectory');

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
    df,
    workingDirectory,
    ipc: {
      send: (channel, data) => {
        // whitelist channels
        let validChannels = ["toMain"];
        if (validChannels.includes(channel)) {
          ipcRenderer.send(channel, data);
        }
      },
      receive: (channel, func) => {
        let validChannels = ["fromMain"];
        if (validChannels.includes(channel)) {
          // Deliberately strip event as it includes `sender`
          ipcRenderer.on(channel, (event, ...args) => func(...args));
        }
      },
    }
  });
});