import {createContext, useState} from 'react'

const defaultValue = {
  output: '',
  setOutput: () => null,
  stdout: '',
  setStdout: () => null,
  stderr: '',
  setStderr: () => null,
  error: '',
  setError: () => null,
}

export const ConsoleContext = createContext(defaultValue);

const ConsoleContextProvider = (props) => {
  const [output, setOutput] = useState('')
  const [stdout, setStdout] = useState('')
  const [stderr, setStderr] = useState('')
  const [error, setError] = useState('')

  const cleanOutput = () => {
    setStdout('')
    setStderr('')
    setError('')
  }

  return (
      <ConsoleContext.Provider value={{
        output, stdout, stderr, error,
        setOutput, setStdout, setStderr, setError,
        cleanOutput
      }}>
        {props.children}
      </ConsoleContext.Provider>
  )
}

export default ConsoleContextProvider
