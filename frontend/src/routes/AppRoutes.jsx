import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

import LandingPage from '../pages/LandingPage'
import LoginPage from "../pages/LoginPage"
import RegisterPage from "../pages/RegisterPage"
import UserLayout from "../layouts/UserLayout"
import DashboardPage from "../pages/DashboardPage"
import RegisterComplaintsPage from "../pages/RegisterComplaintsPage"
import MyComplaintsPage from "../pages/MyComplaintsPage"
import ProfilePage from "../pages/ProfilePage"
import AuthorityLayout from "../layouts/AuthorityLayout"
import DetailedComplaintPage from "../pages/DetailedComplaintPage"
import AdminProfilePage from "../pages/AdminProfilePage"
import AssignedComplaintsPage from "../pages/AssignedCasesPage"
import CaseDetailsPage from "../pages/CaseDetailsPage"
import AvilanleComplaints from "../pages/AvailableComplaintsPage"


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/user' element={<UserLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="register-complaints" element={<RegisterComplaintsPage />} />
          <Route path="my-complaints" element={<MyComplaintsPage />} />
          <Route path="complaint/:id" element={<DetailedComplaintPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="/authority" element={<AuthorityLayout />}>
          <Route index element={<Navigate to="AssignedCasePage" replace />} />
          <Route path="AssignedCasePage" element={<AssignedComplaintsPage />} />
          <Route path="AvilableComplaints" element={<AvilanleComplaints />} />
          <Route path="AdminProfilePage" element={<AdminProfilePage />} />
          <Route path="CaseDetailsPage" element={<CaseDetailsPage />} />
        </Route>
      </Routes>

    </BrowserRouter>
  )
}

