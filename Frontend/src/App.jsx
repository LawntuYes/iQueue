// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './assets/styles/global.css'
import AppRouter from './router/AppRouter'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
  );
}

export default App
