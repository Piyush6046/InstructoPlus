import React, { useEffect, useState } from 'react';
import Card from "../components/Card.jsx";
import { FaArrowLeftLong, FaFilter } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import aiIcon from '../assets/SearchAi.png';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { AnimationContext } from '../App';
import { useContext } from 'react';

function AllCourses() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const navigate = useNavigate();
  const [category, setCategory] = useState([]);
  const [filterCourses, setFilterCourses] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [difficulty, setDifficulty] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { courseData } = useSelector(state => state.course);
  const { fadeIn } = useContext(AnimationContext);

  const toggleCategory = (e) => {
    const value = e.target.value;
    if (category.includes(value)) {
      setCategory(prev => prev.filter(item => item !== value));
    } else {
      setCategory(prev => [...prev, value]);
    }
  };

  const toggleDifficulty = (e) => {
    const value = e.target.value;
    if (difficulty.includes(value)) {
      setDifficulty(prev => prev.filter(item => item !== value));
    } else {
      setDifficulty(prev => [...prev, value]);
    }
  };

  const applyFilter = () => {
    let courseCopy = [...courseData];

    // Category filter
    if (category.length > 0) {
      courseCopy = courseCopy.filter(item => category.includes(item.category));
    }

    // Difficulty filter
    if (difficulty.length > 0) {
      courseCopy = courseCopy.filter(item => difficulty.includes(item.level));
    }

    // Price filter
    courseCopy = courseCopy.filter(item =>
      item.price >= priceRange[0] && item.price <= priceRange[1]
    );

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      courseCopy = courseCopy.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    setFilterCourses(courseCopy);
  };

  useEffect(() => {
    setFilterCourses(courseData || []);
  }, [courseData]);

  useEffect(() => {
    applyFilter();
  }, [category, difficulty, priceRange, searchQuery]);

  const categories = [
    "App Development", "AI/ML", "AI Tools", "Data Science",
    "Data Analytics", "Ethical Hacking", "UI UX Designing",
    "Web Development", "Others"
  ];

  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  return (
    <><Nav/>
    <div className="flex min-h-screen bg-gray-50">


      {/* Toggle Button */}
      <button
        onClick={() => setIsSidebarVisible(prev => !prev)}
        className="fixed top-20 left-4 z-50 bg-white text-black px-3 py-2 rounded-md md:hidden border-2 border-indigo-600 shadow-md flex items-center gap-2"
      >
        <FaFilter /> {isSidebarVisible ? 'Hide' : 'Filters'}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: isSidebarVisible ? 0 : '-100%' }}
        transition={{ duration: 0.3 }}
        className={`w-[280px] h-screen overflow-y-auto bg-white fixed top-0 left-0 p-6 py-24 border-r border-gray-200 shadow-lg z-40 md:block md:translate-x-0`}
      >
        <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800 mb-6">
          <FaArrowLeftLong className='text-gray-600' onClick={() => navigate("/")}/>
          Filter Courses
        </h2>

        <div className="space-y-6">
          {/* Search */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">Search</h3>
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full p-2 border border-gray-300 rounded-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">Categories</h3>
            <div className="space-y-2">
              {categories.map((cat, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-indigo-600 w-4 h-4 rounded"
                    value={cat}
                    onChange={toggleCategory}
                    checked={category.includes(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">Difficulty</h3>
            <div className="space-y-2">
              {difficulties.map((diff, index) => (
                <label key={index} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-indigo-600 w-4 h-4 rounded"
                    value={diff}
                    onChange={toggleDifficulty}
                    checked={difficulty.includes(diff)}
                  />
                  {diff}
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <h3 className="font-medium text-gray-700">Price Range</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>₹0</span>
                <span>₹10,000</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                className="w-full accent-indigo-600"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              />
              <div className="text-center text-sm">
                Up to ₹{priceRange[1].toLocaleString()}
              </div>
            </div>
          </div>

          {/* AI Search Button */}
          <button
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-md font-medium hover:from-indigo-700 hover:to-purple-700 transition"
            onClick={() => navigate("/searchwithai")}
          >
            <img src={aiIcon} className='w-6 h-6' alt="AI Icon" />
            Search with AI
          </button>
        </div>
      </motion.aside>

      {/* Main Courses Section */}
      <main className="w-full transition-all duration-300 py-24 md:pl-[300px] flex flex-wrap gap-6 p-4 md:p-6">
        <div className="w-full flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">All Courses</h1>
          <span className="text-gray-600">{filterCourses.length} courses found</span>
        </div>

        {filterCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filterCourses?.map((item, index) => (
              <Card
                key={index}
                thumbnail={item.thumbnail}
                title={item.title}
                price={item.price}
                category={item.category}
                id={item._id}
                reviews={item.reviews}
                level={item.level}
              />
            ))}
          </div>
        ) : (
          <motion.div
            className="w-full flex flex-col items-center justify-center py-12"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <div className="text-5xl mb-4">📭</div>
            <h2 className="text-xl font-medium text-gray-700 mb-2">No courses found</h2>
            <p className="text-gray-500 text-center max-w-md">
              Try adjusting your filters or search term to find what you're looking for.
            </p>
            <button
              className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 transition"
              onClick={() => {
                setCategory([]);
                setDifficulty([]);
                setPriceRange([0, 10000]);
                setSearchQuery("");
              }}
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </main>
    </div>
    </>
  );
}

export default AllCourses;