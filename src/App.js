import React, {useContext, useState} from "react";
import CommandsOutput from "./components/CommandsOutput";
import {GlobalDataContext} from "./contexts/GlobalDataContext";

const App = () => {
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState('')
  const [stdout, setStdout] = useState('')
  const [stderr, setStderr] = useState('')
  const [error, setError] = useState('')
  const data = useContext(GlobalDataContext)

  console.log("This is defauylt data from global data context")
  console.log(data)

  console.log(window.api)

  const run = (command, pathToDir) => {
    setLoading(true)
    setRunning(true)
    let entry = {command, stdout: "", stderr: "", error: null, running: true}
    const onout = (data) => {
      setLoading(previous => previous && false)
      setStdout(previous => previous + data)
    }
    const onerr = (data) => {
      setLoading(previous => previous && false)
      setStderr(previous => previous + data)
    }
    const ondone = (code) => {
      setError(code !== 0)
      setRunning(previous => previous && false)
    }

    window.api.runCommandAdvanced({command,onout,onerr,ondone, pathToDir})
  }

  const pathToDir = '/Users/marckraw/Projects/EF/ef-sbc/@documentation'

  const syncSchemasAllComponentsWithExtension = () => {
    run("sb-mig sync components --all --ext", pathToDir)
  }

  const syncSchemasAllComponentsWithExtensionWithPresets = () => {
    run("sb-mig sync components --all --ext --presets", pathToDir)
  }

  const showDebug = () => {
    run("sb-mig debug", pathToDir)
  }

  const showVersion = () => {
    run("sb-mig --version", pathToDir)
  }

  const backupAllComponents = async () => {
    run("sb-mig backup --allComponents", pathToDir)
  }

  const backupAllPresets = () => {
    run("sb-mig backup --allPresets", pathToDir)
  }

  const showDirectoryContent = async () => {
    const directory = window.api.currentDirectory()
    const data = await window.api.directoryContents(directory)
    console.log(data)
  }

  const showPath = () => {
    return window.api.showPath()
  }

  const cleanOutput = () => {
    setStdout('')
    setStderr('')
    setError('')
  }

  return (
    <div>
      <h3>working directory: {data?.workDir}</h3>
      <hr/>
      <button onClick={syncSchemasAllComponentsWithExtension}>Sync schemas (all components with extension)</button>
      <button onClick={syncSchemasAllComponentsWithExtensionWithPresets}>Sync schemas (all components with extension and presets)</button>
      <hr/>
      <button onClick={showDebug}>Show DEBUG - what variables sb-mig using</button>
      <button onClick={showVersion}>Show sb-mig version</button>
      <hr/>
      <button onClick={backupAllComponents}>Backup All Components</button>
      <button onClick={backupAllPresets}>Backup All Presets</button>
      <hr/>
      <button onClick={cleanOutput}>Clean CommandsOutput</button>
      <hr/>
      <button onClick={showDirectoryContent}>Show dir content</button>

      <pre>
        {showPath()}
      </pre>
      <CommandsOutput stderr={stderr} stdout={stdout} running={running} loading={loading} />
    </div>
  );
};

export default App;
