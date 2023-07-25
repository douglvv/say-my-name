import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { SocketContext, socket } from './contexts/SocketContext.js'
import store from './redux/store.js'
import { ReactNotifications } from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SocketContext.Provider value={socket}>
      <Provider store={store}>
        <div className="app-container">
          <ReactNotifications />
          <App />
        </div>
      </Provider>
    </SocketContext.Provider>
  </React.StrictMode>,
)
