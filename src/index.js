import React from 'react';
import ReactDOM from 'react-dom';
import './styles/main.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalDataContextProvider from "./contexts/GlobalDataContext";
import SbMigContextProvider from "./contexts/sb-migContext";
import ConsoleContextProvider from "./contexts/ConsoleContext";
import GlobalStatusContextProvider from "./contexts/GlobalStatusContext";

ReactDOM.render(
    <React.StrictMode>
      <GlobalStatusContextProvider>
        <ConsoleContextProvider>
          <GlobalDataContextProvider>
            <SbMigContextProvider>
                <App />
            </SbMigContextProvider>
          </GlobalDataContextProvider>
        </ConsoleContextProvider>
      </GlobalStatusContextProvider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
