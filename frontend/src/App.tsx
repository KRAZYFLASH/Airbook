import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home/Home'
import Promo from './pages/Promo/Promo'
import Destination from './pages/Destination/Destination'
import Help from './pages/Help/Help'
import Login from './components/Login'
import Signup from './components/Signup'
import MainLayout from './components/MainLayout'

const App: React.FC = () => {
  return (
    <Routes>
      {/* Semua route dengan Navbar */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/promo" element={<Promo />} />
        <Route path="/destination" element={<Destination />} />
        <Route path="/help" element={<Help />} />
      </Route>

      {/* Route tanpa Navbar */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  )
}

export default App
