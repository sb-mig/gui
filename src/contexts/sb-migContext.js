import {createContext, useContext, useEffect, useState} from 'react'
import {GlobalDataContext} from "./GlobalDataContext";
import {ConsoleContext} from "./ConsoleContext";
import {GlobalStatusContext} from "./GlobalStatusContext";

const defaultValue = {
  data: 'Default data',
  setData: () => null,
}

export const SbMigContext = createContext(defaultValue);

const SbMigContextProvider = (props) => {
  const [data, setData] = useState(defaultValue.data)
  const {workDir} = useContext(GlobalDataContext)
  const {setLoading, setRunning} = useContext(GlobalStatusContext)
  const {setStdout, setStderr, setError} = useContext(ConsoleContext)

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

  const syncSchemasAllComponentsWithExtension = () => {
    run("sb-mig sync components --all --ext", workDir)
  }

  const syncSchemasAllComponentsWithExtensionWithPresets = () => {
    run("sb-mig sync components --all --ext --presets", workDir)
  }

  const showDebug = () => {
    run("sb-mig debug", workDir)
  }

  const showVersion = () => {
    run("sb-mig --version", workDir)
  }

  const backupAllComponents = async () => {
    run("sb-mig backup --allComponents", workDir)
  }

  const backupAllPresets = () => {
    run("sb-mig backup --allPresets", workDir)
  }

  return (
      <SbMigContext.Provider value={{
        data,
        setData,
        methods: {
          syncSchemasAllComponentsWithExtension,
          syncSchemasAllComponentsWithExtensionWithPresets,
          showDebug,
          showVersion,
          backupAllComponents,
          backupAllPresets,
        }
      }}>
        {props.children}
      </SbMigContext.Provider>
  )
}

export default SbMigContextProvider
