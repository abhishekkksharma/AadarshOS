import { useState } from 'react'
import './App.css'
import BootScreen from './Pages/BootScreen'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LoginScreen from './Pages/LoginScreen'
import Desktop from './Pages/Desktop'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<BootScreen />} />
        <Route path="/LoginScreen" element={<LoginScreen />} />
        <Route path="/Desktop" element={<Desktop />} />
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
