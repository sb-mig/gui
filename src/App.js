import React, {useState} from "react";

const App = () => {
  const [output, setOutput] = useState('')
  const [stdout, setStdout] = useState('')
  const [stderr, setStderr] = useState('')
  const [error, setError] = useState('')

  console.log(window.api)

  const run = (command, pathToDir) => {
    let entry = {command, stdout: "", stderr: "", error: null, running: true}
    const onout = (data) => {
      setStdout(previous => previous + data)
    }
    const onerr = (data) => {
      setStderr(previous => previous + data)
    }
    const ondone = (code) => {
      setError(code !== 0)
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

  return (
    <div>
      <button onClick={syncSchemasAllComponentsWithExtension}>Sync schemas (all components with extension)</button>
      <button onClick={syncSchemasAllComponentsWithExtensionWithPresets}>Sync schemas (all components with extension and presets)</button>
      <hr/>
      <button onClick={showDebug}>Show DEBUG - what variables sb-mig using</button>
      <button onClick={showVersion}>Show sb-mig version</button>
      <hr/>
      <button onClick={backupAllComponents}>Backup All Components</button>
      <button onClick={backupAllPresets}>Backup All Presets</button>
      <div>
        <h3>Messages</h3>
        <pre>
          {stdout}
        </pre>
        <h3>Errors</h3>
        {stderr}
      </div>
    </div>
  );
};

export default App;
