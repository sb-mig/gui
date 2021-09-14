import React from "react";

// form.addEventListener("submit", (e) => {
//   e.preventDefault()
//   let command = input.value
//   let output = window.api.runCommand(command)
//   createTerminalHistoryEntry(command, output)
//   input.value = ""
//   input.scrollIntoView()
// })

const App = () => {
  console.log(window.api)
  const output = window.api.runCommand("sb-mig --version")
  const debugInfo = window.api.runCommand("sb-mig debug")
  console.log(output)
  return (
    <div>
        Moja apka
    </div>
  );
};

export default App;
