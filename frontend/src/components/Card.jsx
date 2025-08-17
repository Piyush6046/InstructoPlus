import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimationContext } from "../App";
import { useContext } from "react";

const CourseCard = ({ thumbnail, title, category, price, id, reviews, level }) => {
  const navigate = useNavigate();
  const { fadeUpItem } = useContext(AnimationContext);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(reviews);
  const difficultyColors = {
    Beginner: "bg-green-100 text-green-800",
    Intermediate: "bg-yellow-100 text-yellow-800",
    Advanced: "bg-red-100 text-red-800"
  };

  return (
    <motion.div
      variants={fadeUpItem}
      whileHover={{
        y: -10,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
      }}
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer h-full"
      onClick={() => navigate(`/viewcourse/${id}`)}
    >
      <div className="relative">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-48 object-cover"
        />
        {level && (
          <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[level]}`}>
            {level}
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 h-14">{title}</h3>
          <span className="text-lg font-bold text-indigo-700">₹{price}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs capitalize">
            {category}
          </span>

          <div className="flex items-center gap-1">
            <FaStar className="text-yellow-400" />
            <span className="text-sm font-medium">{avgRating || "New"}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;