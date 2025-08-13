import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
export const serverUrl = "http://localhost:8000"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useGetCurrentUser from './customHooks/getCurrentUser.js'

function App() {
  useGetCurrentUser(); // Using the hook properly inside the component
  
  return (
    <>
      <Routes>
        <Route path="" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
