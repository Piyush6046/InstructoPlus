import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import Dashboard from './pages/Educator/Dashboard'
import Courses from './pages/Educator/Courses'
export const serverUrl = "http://localhost:8000"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import getCurrentUser from './customHooks/getCurrentUser.js'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile.jsx'
import ForgotPassword from "./pages/ForgotPassword.jsx"
import EditProfile from './pages/EditProfile.jsx'
import EditCourse from './pages/Educator/EditCourse.jsx'
import CreateCourse from './pages/Educator/CreateCourse.jsx'
import getCreatorCourse from './customHooks/getCreatorCourse.js'
import AllCourses from './pages/AllCourses.jsx'; // Import AllCourses component

function App() {
  getCurrentUser();
  getCreatorCourse();
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
        <Route path='/dashboard' element={userData?.user.role==="educator" ? <Dashboard/> : <Navigate to="/signup" />}/>
        <Route path='/courses' element={userData?.user.role==="educator" ? <Courses/> : <Navigate to="/signup" />}/>

        <Route path='/editcourses/:courseId' element={userData?.user.role==="educator" ? <EditCourse/> : <Navigate to="/signup" />}/>

        <Route path='/createcourses' element={userData?.user.role=="educator" ? <CreateCourse/> : <Navigate to="/signup" />}/>
        <Route path="/allcourses" element={<AllCourses />} />
      </Routes>
      <ToastContainer />
    </>
  )
}

export default App
