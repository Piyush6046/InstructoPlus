import React, { useState, useRef, useEffect } from "react";
import logo from "../assets/logo.jpg";
import { IoMdPerson } from "react-icons/io";
import { GiHamburgerMenu, GiSplitCross } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import { AnimationContext } from "../App";
import { useContext } from "react";

function Nav() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const profileRef = useRef(null);
  const { fadeIn } = useContext(AnimationContext);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        serverUrl + "/api/auth/logout",
        {},
        { withCredentials: true }
      );
      dispatch(setUserData(null));
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2 } }
  };

  const mobileMenuVariants = {
    hidden: { x: "100%" },
    visible: { x: 0, transition: { duration: 0.3 } },
    exit: { x: "100%" }
  };

  return (
    <nav className="fixed w-full bg-white shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0 flex items-center"
          >
            <img
              src={logo}
              className="h-10 w-auto rounded-md cursor-pointer"
              onClick={() => navigate("/")}
              alt="InstructoPlus Logo"
            />
            <span className="ml-2 text-xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              InstructoPlus
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {userData && (
              <div className="relative" ref={profileRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  {userData?.user?.photoUrl ? (
                    <img
                      src={userData.user.photoUrl}
                      className="h-10 w-10 rounded-full object-cover border-2 border-gray-200"
                      alt="Profile"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center text-lg font-medium border-2 border-gray-200">
                      {userData?.user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-gray-700 font-medium">
                    {userData?.user?.name}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200"
                    >
                      <motion.button
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                        onClick={() => {
                          navigate("/profile");
                          setShowProfileMenu(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 w-full text-left"
                      >
                        My Profile
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                        onClick={() => {
                          navigate("/enrolledcourses");
                          setShowProfileMenu(false);
                        }}
                        className="block px-4 py-2 text-sm text-gray-700 w-full text-left"
                      >
                        My Courses
                      </motion.button>
                      {userData?.user?.role === "educator" && (
                        <motion.button
                          whileHover={{ backgroundColor: "#f3f4f6" }}
                          onClick={() => {
                            navigate("/dashboard");
                            setShowProfileMenu(false);
                          }}
                          className="block px-4 py-2 text-sm text-gray-700 w-full text-left"
                        >
                          Dashboard
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ backgroundColor: "#f3f4f6" }}
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 w-full text-left"
                      >
                        Logout
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {!userData && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Login
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {showMobileMenu ? (
                <GiSplitCross className="h-6 w-6" />
              ) : (
                <GiHamburgerMenu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
            className="md:hidden fixed inset-y-0 right-0 w-4/5 bg-white z-40 shadow-xl"
          >
            <div className="h-full flex flex-col py-8 px-6">
              <div className="flex justify-end mb-8">
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowMobileMenu(false)}
                  className="p-2 rounded-full bg-gray-100"
                >
                  <GiSplitCross className="h-5 w-5" />
                </motion.button>
              </div>

              {userData ? (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center space-x-3 mb-8 p-4 bg-gray-50 rounded-lg"
                  >
                    {userData?.user?.photoUrl ? (
                      <img
                        src={userData.user.photoUrl}
                        className="h-12 w-12 rounded-full object-cover border-2 border-gray-200"
                        alt="Profile"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center justify-center text-lg font-medium border-2 border-gray-200">
                        {userData?.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {userData?.user?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userData?.user?.role}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-4"
                  >
                    <motion.button
                      whileHover={{ x: 10 }}
                      onClick={() => {
                        navigate("/profile");
                        setShowMobileMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
                    >
                      <IoMdPerson className="mr-3 text-indigo-600" />
                      My Profile
                    </motion.button>
                    <motion.button
                      whileHover={{ x: 10 }}
                      onClick={() => {
                        navigate("/enrolledcourses");
                        setShowMobileMenu(false);
                      }}
                      className="w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      My Courses
                    </motion.button>
                    {userData?.user?.role === "educator" && (
                      <motion.button
                        whileHover={{ x: 10 }}
                        onClick={() => {
                          navigate("/dashboard");
                          setShowMobileMenu(false);
                        }}
                        className="w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8l4-2 4 2V6z" clipRule="evenodd" />
                        </svg>
                        Dashboard
                      </motion.button>
                    )}
                    <motion.button
                      whileHover={{ x: 10 }}
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 rounded-md flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                      </svg>
                      Logout
                    </motion.button>
                  </motion.div>
                </>
              ) : (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={() => {
                    navigate("/login");
                    setShowMobileMenu(false);
                  }}
                  className="w-full px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 mt-8"
                >
                  Login
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Nav;