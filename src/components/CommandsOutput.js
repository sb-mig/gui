import React from 'react'

const CommandsOutput = (props) => {
  const {stderr, stdout, loading, running} = props;

  return (
      <div>
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