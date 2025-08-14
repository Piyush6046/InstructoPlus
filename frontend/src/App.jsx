import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
export const serverUrl = "http://localhost:8000"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getCurrentUser from './customHooks/getCurrentUser.js'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile.jsx'
import ForgotPassword from "./pages/ForgotPassword.jsx"
import EditProfile from './pages/EditProfile.jsx'
function App() {
  getCurrentUser();
  const {userData}  = useSelector((state) => state.user);
  return (
    <>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={!userData ? <Navigate to="/signup" /> : <Profile />} />
         <Route path="/forgotpassword" element={!userData ? <Navigate to="/signup" /> : <ForgotPassword />} />
         <Route path="/editprofile" element={!userData ? <Navigate to="/signup" /> : <EditProfile />} />"
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
