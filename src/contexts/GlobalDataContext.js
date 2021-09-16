import {createContext, useEffect, useState} from 'react'

const defaultValue = {
  workDir: '/',
  setWorkDir: () => null,
  data: 'Default data',
  setData: () => null,
}

export const GlobalDataContext = createContext(defaultValue);

const GlobalDataContextProvider = (props) => {
  const [data, setData] = useState(defaultValue.data)
  const [workDir, setWorkDir] = useState(defaultValue.workDir)

  useEffect(() => {
    (async () => {
      console.log("useeffect from GlobalDataContext")
      window.api.ipc.receive('fromMain', (data) => {
        console.log(data)
        setWorkDir(data.filePaths[0])
      })
    })()
  }, [])

  return (
      <GlobalDataContext.Provider value={{
        data,
        setData,
        workDir,
        setWorkDir
      }}>
        {props.children}
      </GlobalDataContext.Provider>
  )
}

export default GlobalDataContextProvider
