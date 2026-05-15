import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom"

import HomePage from "../pages/HomePage"
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import LandingPage from '../pages/LandingPage'
import Userpage from "../pages/UserPage"
import AuthorityPage from "../pages/AuthorityPage"

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/user' element={<Userpage />} />
        <Route path="/authority" element={<AuthorityPage />} />
      </Routes>

    </BrowserRouter>
  )
}

