import { BrowserRouter, Routes, Route } from "react-router-dom"

import LandingPage from '../pages/LandingPage'
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import UserLayout from "../layouts/UserLayout"
import DashboardPage from "../pages/DashboardPage"
import RegisterComplaintsPage from "../pages/RegisterComplaintsPage"
import MyComplaintsPage from "../pages/MyComplaintsPage"
import ProfilePage from "../pages/ProfilePage"
import AuthorityLayout from "../layouts/AuthorityLayout"


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/user' element={<UserLayout />}>
          <Route path="dashboard" element={<DashboardPage/>}/>
          <Route path="register-complaints" element={<RegisterComplaintsPage/>} />
          <Route path="my-complaints" element={<MyComplaintsPage/>}/>
          <Route path="profile" element={<ProfilePage/>}/>
          </Route>
        <Route path="/authority" element={<AuthorityLayout />} />
      </Routes>

    </BrowserRouter>
  )
}

