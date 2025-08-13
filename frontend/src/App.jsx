import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
export const serverUrl = "http://localhost:8000"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getCurrentUser from './customHooks/getCurrentUser.js'
import { store } from './redux/store.js'

function App() {
  getCurrentUser();
  console.log("current user data", JSON.stringify(store.getState().user));
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
