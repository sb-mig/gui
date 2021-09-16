import React, {useContext, useState} from "react";
import CommandsOutput from "./CommandsOutput";
import {GlobalDataContext} from "../contexts/GlobalDataContext";
import styled, {css, keyframes} from 'styled-components'
import Status from "./Status";

const Button = styled.button`
  border-radius: 3px;
  padding: 16px 8px;andsOutput;
  margin: 2px;
  background: white;
  color: black;
  border: 1px solid black;
  
  &:hover {
    background: gray;
    color: white;
  }
  
  &:active {
    color: black;
    background: white;
  }

  /* The GitHub button is a primary button
   * edit this to target it specifically! */
  ${props => props.primary && css`
    background: white;
    color: black;
  `}
`

const Main = () => {
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState('')
  const [stdout, setStdout] = useState('')
  const [stderr, setStderr] = useState('')
  const [error, setError] = useState('')
  const data = useContext(GlobalDataContext)

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
    run("sb-mig sync components --all --ext", data.workDir)
  }

  const syncSchemasAllComponentsWithExtensionWithPresets = () => {
    run("sb-mig sync components --all --ext --presets", data.workDir)
  }

  const showDebug = () => {
    run("sb-mig debug", data.workDir)
  }

  const showVersion = () => {
    run("sb-mig --version", data.workDir)
  }

  const backupAllComponents = async () => {
    run("sb-mig backup --allComponents", data.workDir)
  }

  const backupAllPresets = () => {
    run("sb-mig backup --allPresets", data.workDir)
  }

  const showDirectoryContent = async () => {
    try {
      const temp = await window.api.directoryContents(data.workDir)
      console.log(temp)
    } catch (e) {
      console.log("error happened")
      console.log(e)
    }
  }

  const cleanOutput = () => {
    setStdout('')
    setStderr('')
    setError('')
  }

  return (
      <div>
        <h3>working directory: {data?.workDir}</h3>
        Loading: <Status loading={loading} />
        Running: <Status loading={running} />
        <hr/>
        <Button onClick={syncSchemasAllComponentsWithExtension}>Sync schemas (all components with extension)
        </Button>
        <Button onClick={syncSchemasAllComponentsWithExtensionWithPresets}>Sync schemas (all components with
          extension and presets)
        </Button>
        <hr/>
        <Button onClick={showDebug}>Show DEBUG - what variables sb-mig using</Button>
        <Button onClick={showVersion}>Show sb-mig version</Button>
        <hr/>
        <Button onClick={backupAllComponents}>Backup All Components</Button>
        <Button onClick={backupAllPresets}>Backup All Presets</Button>
        <hr/>
        <Button onClick={cleanOutput}>Clean CommandsOutput</Button>
        <hr/>
        <Button onClick={showDirectoryContent}>Show dir content</Button>
        <CommandsOutput stderr={stderr} stdout={stdout} running={running} loading={loading}/>
      </div>
  )
}

export default Main