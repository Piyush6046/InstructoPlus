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
import AllCourses from './pages/AllCourses.jsx'
import CreateLecture from './pages/Educator/CreateLecture.jsx'
import { motion, AnimatePresence } from 'framer-motion'
import ViewCourse from './pages/ViewCourse.jsx'
import EditLecture from './pages/Educator/EditLecture.jsx'
import Nav from './components/Nav.jsx'
import ViewLecture from './pages/ViewLectures.jsx'
import EnrolledCourse from './pages/EnrolledCourse.jsx'

// Animation context
export const AnimationContext = React.createContext({
  fadeIn: {},
  slideIn: {},
  staggerChildren: {}
});

function App() {
  getCurrentUser();
  const {userData} = useSelector((state) => state.user);
  getCreatorCourse(); // Call the hook inside the functional component

  // Animation variants
  const animationVariants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.6 } }
    },
    slideIn: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    },
    staggerChildren: {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1
        }
      }
    },
    fadeUpItem: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    }
  };

  return (
    <AnimationContext.Provider value={animationVariants}>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={!userData ? <SignUp /> : <Navigate to="/" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={!userData ? <Navigate to="/signup" /> : <Profile />} />
          <Route path="/forgotpassword" element={!userData ? <Navigate to="/signup" /> : <ForgotPassword />} />
          <Route path="/editprofile" element={!userData ? <Navigate to="/signup" /> : <EditProfile />} />
          <Route path='/dashboard' element={userData?.user.role==="educator" ? <Dashboard/> : <Navigate to="/signup" />}/>
          <Route path='/courses' element={userData?.user.role==="educator" ? <Courses/> : <Navigate to="/signup" />}/>
          <Route path='/editcourses/:courseId' element={userData?.user.role==="educator" ? <EditCourse/> : <Navigate to="/signup" />}/>
          <Route path='/createcourses' element={userData?.user.role=="educator" ? <CreateCourse/> : <Navigate to="/signup" />}/>
          <Route path="/allcourses" element={<AllCourses />} />
          <Route path='/createlecture/:courseId' element={userData?.user.role=="educator" ? <CreateLecture/> : <Navigate to="/signup" />}/>
          <Route path='/viewcourse/:courseId'element={userData?.user.role==="educator" ? <ViewCourse/> : <Navigate to="/signup" />} />
          <Route path='/editlecture/:courseId/:lectureId' element={userData?.user.role==="educator" ? <EditLecture/> : <Navigate to="/signup" />} />
          <Route path='/viewlecture/:courseId' element={<ViewLecture />} />
          <Route path='/enrolledcourses/' element={userData?<EnrolledCourse/> : <Navigate to="/login" />} />
        </Routes>
      </AnimatePresence>
      <ToastContainer position="top-center" autoClose={3000} />
    </AnimationContext.Provider>
  )
}

export default App
