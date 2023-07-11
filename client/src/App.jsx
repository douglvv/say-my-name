import { SocketContext, socket } from './contexts/SocketContext'
import AppRoutes from './routes/routes'

function App() {
  return (
    <>
      <SocketContext.Provider value={socket}>
        <AppRoutes />
      </SocketContext.Provider>
    </>
  )
}

export default App
