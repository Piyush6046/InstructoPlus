import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AnimationContext } from "../App";
import { useContext } from "react";

const CourseCard = ({ thumbnail, title, category, price, id, reviews }) => {
  const navigate = useNavigate();
  const { fadeUpItem } = useContext(AnimationContext);

  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(reviews);

  return (
    <motion.div
      variants={fadeUpItem}
      whileHover={{
        y: -10,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer h-full"
      onClick={() => navigate(`/viewcourse/${id}`)}
    >
      <div className="relative overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
            {title}
          </h3>
        </div>
      </div>

      <div className="p-6">
        <span className="inline-block px-3 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-full mb-4">
          {category}
        </span>

        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">₹{price}</span>

          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="text-gray-700 font-medium">
              {avgRating || "New"}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CourseCard;