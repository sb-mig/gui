import {createContext, useState} from 'react'

const defaultValue = {
  loading: false,
  setLoading: () => null,
  running: false,
  setRunning: () => null,
}

export const GlobalStatusContext = createContext(defaultValue);

const GlobalStatusContextProvider = (props) => {
  const [loading, setLoading] = useState(false)
  const [running, setRunning] = useState(false)

  return (
      <GlobalStatusContext.Provider value={{
        loading, setLoading,
        running, setRunning
      }}>
        {props.children}
      </GlobalStatusContext.Provider>
  )
}

export default GlobalStatusContextProvider
