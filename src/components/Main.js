import React, {useContext} from "react";
import CommandsOutput from "./CommandsOutput";
import {GlobalDataContext} from "../contexts/GlobalDataContext";
import {Button} from './styled/Button'
import Status from "./Status";
import {GlobalStatusContext} from '../contexts/GlobalStatusContext'
import {SbMigContext} from "../contexts/sb-migContext";
import {ConsoleContext} from "../contexts/ConsoleContext";

const Main = () => {
  const {workDir} = useContext(GlobalDataContext)
  const {loading, running} = useContext(GlobalStatusContext)
  const {stderr, stdout, cleanOutput} = useContext(ConsoleContext)
  const {methods: {
    syncSchemasAllComponentsWithExtension,
    syncSchemasAllComponentsWithExtensionWithPresets,
    showDebug,
    backupAllComponents,
    backupAllPresets
  }} = useContext(SbMigContext)

  const showDirectoryContent = async () => {
    try {
      const temp = await window.api.directoryContents(workDir)
      console.log(temp)
    } catch (e) {
      console.log("error happened")
      console.log(e)
    }
  }

  return (
      <div>
        <h3>working directory: {workDir}</h3>
        <div>
          <hr/>
          <Button primary onClick={syncSchemasAllComponentsWithExtension}>Sync components (ext)</Button>
          <Button onClick={syncSchemasAllComponentsWithExtensionWithPresets}>Sync components (ext + presets)</Button>
          <Button onClick={showDebug}>Show DEBUG</Button>
          <Button onClick={backupAllComponents}>Backup All Components</Button>
          <Button onClick={backupAllPresets}>Backup All Presets</Button>
          <Button secondary onClick={cleanOutput}>Clear console</Button>
          <Button onClick={showDirectoryContent}>Show dir content</Button>
        </div>
        <CommandsOutput stderr={stderr} stdout={stdout} running={running} loading={loading}/>
      </div>
  )
}

export default Main