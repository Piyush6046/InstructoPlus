import React from "react";
import { FaStar } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";

const ReviewCard = ({ text, name, image, rating, role, title }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 max-w-sm w-full flex flex-col h-full">
      {/* Course Title */}
      {title && (
        <div className="mb-3">
          <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
            {title}
          </span>
        </div>
      )}

      {/* Rating Stars with numeric value */}
      <div className="flex items-center mb-4">
        <div className="flex text-yellow-400 text-sm mr-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <span key={i} className="mr-0.5">
                {i < rating ? <FaStar /> : <FaRegStar />}
              </span>
            ))}
        </div>
        <span className="text-sm font-medium text-gray-600">{rating.toFixed(1)}</span>
      </div>

      {/* Review Text */}
      <p className="text-gray-700 text-sm mb-5 flex-grow line-clamp-4">
        {text}
      </p>

      {/* Reviewer Info */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={image || "/default-avatar.png"}
            alt={name}
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/default-avatar.png";
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-800 text-sm truncate">{name}</h4>
          <p className="text-xs text-gray-500 truncate">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;