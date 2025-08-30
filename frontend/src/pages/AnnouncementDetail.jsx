import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { serverUrl } from "../App";
import { format } from "date-fns"; // You might need to install date-fns: npm install date-fns

function AnnouncementDetail() {
  const { id } = useParams(); // announcementId
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${serverUrl}/api/announcements/${id}`, {
          withCredentials: true,
        });
        setAnnouncement(response.data.announcement);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch announcement details.");
        toast.error(err.response?.data?.message || "Failed to fetch announcement details.");
        console.error("Error fetching announcement:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Loading announcement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Announcement not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          {announcement.title}
        </h1>
        <div className="flex items-center text-sm text-gray-600 mb-6">
          {announcement.sender?.photoUrl ? (
            <img
              src={announcement.sender.photoUrl}
              alt={announcement.sender.name}
              className="h-8 w-8 rounded-full mr-2 object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-medium mr-2">
              {announcement.sender?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <p>
            By <span className="font-medium">{announcement.sender?.name || "Unknown Educator"}</span> on{" "}
            {format(new Date(announcement.createdAt), "PPP p")}
          </p>
        </div>
        <p className="text-gray-800 leading-relaxed mb-8">
          {announcement.description}
        </p>

        {announcement.attachmentUrl && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Attachment:</h3>
            <a
              href={announcement.attachmentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 underline flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
              </svg>
              View Attachment
            </a>
          </div>
        )}

        <button
          onClick={() => navigate(-1)}
          className="mt-8 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Notifications
        </button>
      </div>
    </div>
  );
}

export default AnnouncementDetail;
