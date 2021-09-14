import React from 'react'

const CommandsOutput = (props) => {
  const {stderr, stdout, loading, running} = props;

  return (
      <div>
        <h1>Status = Loading: {loading ? <span>Loading</span> : <span>Done</span>} ------------- Running: {running ? <span>Running</span>: <span>Done</span>}</h1>
        <h3>Messages</h3>
        {
          loading ? 'Loading' : (
              <pre>
                {stdout}
              </pre>
          )
        }
        <h3>Errors</h3>
        {
          loading ? 'Loading' : (
              <pre>
          {stderr}
        </pre>
          )
        }
      </div>
  )
}

export default CommandsOutput