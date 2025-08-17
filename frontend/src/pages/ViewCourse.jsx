import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import { FaArrowLeftLong, FaClone, FaRobot } from "react-icons/fa6";
import img from "../assets/empty.jpg"
import Card from "../components/Card.jsx"
import { setSelectedCourseData } from '../redux/courseSlice';
import { FaLock, FaPlayCircle, FaDownload } from "react-icons/fa";
import { toast } from 'react-toastify';
import { FaStar } from "react-icons/fa6";
import { ClipLoader } from 'react-spinners';
import Nav from '../components/Nav.jsx';

function ViewCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courseData, selectedCourseData } = useSelector(state => state.course);
  const { userData } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [creatorData, setCreatorData] = useState(null);
  const [selectedLecture, setSelectedLecture] = useState(null);
  const [selectedCreatorCourse, setSelectedCreatorCourse] = useState([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showAISidebar, setShowAISidebar] = useState(false);
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  // Calculate average rating
  const avgRating = selectedCourseData?.reviews?.length > 0
    ? (selectedCourseData.reviews.reduce((sum, review) => sum + review.rating, 0) / selectedCourseData.reviews.length).toFixed(1)
    : 0;

  // Initialize data on component mount
  useEffect(() => {
    if (courseData) {
      const course = courseData.find(item => item._id === courseId);
      if (course) dispatch(setSelectedCourseData(course));
    }

    const verify = userData?.enrolledCourses?.some(c => {
      const enrolledId = typeof c === 'string' ? c : c._id;
      return enrolledId?.toString() === courseId?.toString();
    });
    setIsEnrolled(!!verify);
  }, [courseId, courseData, userData]);

  // Fetch creator data
  useEffect(() => {
    const fetchCreatorData = async () => {
      if (selectedCourseData?.creator) {
        try {
          const creatorRes = await axios.post(
            `${serverUrl}/api/course/getcreator`,
            { userId: selectedCourseData.creator },
            { withCredentials: true }
          );
          const creator = creatorRes.data.user;
          setCreatorData(creator);

          if (creator) {
            const coursesRes = await axios.get(
              `${serverUrl}/api/course/getbycreator/${creator._id}`,
              { withCredentials: true }
            );
            const otherCourses = coursesRes.data.courses.filter(
              (course) => course._id !== courseId
            );
            setSelectedCreatorCourse(otherCourses);
          }
        } catch (error) {
          console.error("Error fetching creator data:", error);
        }
      }
    };
    fetchCreatorData();
  }, [selectedCourseData, courseId]);

  const handleReview = async () => {
    try {
      await axios.post(serverUrl + "/api/review/givereview",
        { rating, comment, courseId },
        { withCredentials: true }
      );
      toast.success("Review Added");
      setRating(0);
      setComment("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding review");
    }
  };

  const handleEnroll = async () => {
    try {
      const orderData = await axios.post(serverUrl + "/api/payment/create-order",
        { courseId, userId: userData._id },
        { withCredentials: true }
      );

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: "INR",
        name: "Virtual Courses",
        description: "Course Enrollment Payment",
        order_id: orderData.data.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(serverUrl + "/api/payment/verify-payment",
              { ...response, courseId, userId: userData._id },
              { withCredentials: true }
            );
            setIsEnrolled(true);
            toast.success(verifyRes.data.message);
          } catch (verifyError) {
            toast.error("Payment verification failed.");
          }
        },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      toast.error("Something went wrong while enrolling.");
    }
  };

  const handleCloneCourse = async () => {
    try {
      const response = await axios.post(`${serverUrl}/api/course/clone`,
        { courseId: selectedCourseData._id, userId: userData._id },
        { withCredentials: true }
      );
      toast.success("Course cloned successfully!");
      navigate(`/creator/edit-course/${response.data.course._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clone course");
    }
  };

  const askAIQuestion = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    // Simulate API call - replace with actual Claude API integration
    setTimeout(() => {
      setAiResponse(`Based on the course content, here's what you need to know about "${aiQuery}": This concept is covered in detail in the course materials. You can find practical examples and exercises related to this topic.`);
      setAiLoading(false);
    }, 1500);
  };

  return (
    <>
    <Nav/>
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 relative">
      {/* AI Sidebar */}

      {showAISidebar && (
        <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-xl z-50 overflow-y-auto">
            <Nav />
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <FaRobot className="text-indigo-600 text-2xl" />
                <h2 className="text-xl font-bold">Course Assistant</h2>
              </div>
              <button onClick={() => setShowAISidebar(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>

            {aiResponse && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">{aiResponse}</p>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about this course..."
                className="flex-1 p-3 border border-gray-300 rounded-lg"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                disabled={aiLoading}
              />
              <button
                onClick={askAIQuestion}
                className="px-4 py-3 bg-indigo-600 text-white rounded-lg"
                disabled={aiLoading}
              >
                {aiLoading ? <ClipLoader size={16} color="white" /> : "Ask"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Button */}
      <button
        onClick={() => setShowAISidebar(true)}
        className="fixed right-6 bottom-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg z-40 hover:bg-indigo-700"
      >
        <FaRobot className="text-xl" />
      </button>

      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 mb-4 hover:text-black">
          <FaArrowLeftLong className="w-5 h-5" />
          <span>Back to Courses</span>
        </button>

        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/5">
              <img
                src={selectedCourseData?.thumbnail || img}
                alt="Course Thumbnail"
                className="rounded-xl w-full object-cover aspect-video"
              />
            </div>

            <div className="md:w-3/5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{selectedCourseData?.title}</h1>
                  <p className="text-gray-600 mt-1">{selectedCourseData?.subTitle}</p>
                </div>
                {userData?._id === selectedCourseData?.creator && (
                  <button onClick={handleCloneCourse} className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-100">
                    <FaClone /> Clone
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                  <FaStar className="text-yellow-500" />
                  <span className="font-medium">{avgRating}</span>
                  <span className="text-gray-500 ml-1">({selectedCourseData?.reviews?.length || 0} reviews)</span>
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">{selectedCourseData?.lectures?.length || 0} Lectures</div>
                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">{selectedCourseData?.category}</div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xl font-semibold text-black">₹{selectedCourseData?.price}</span>
                  <span className="line-through text-gray-400 ml-2">₹{Math.round(selectedCourseData?.price * 1.5)}</span>
                </div>
                {!isEnrolled ? (
                  <button onClick={handleEnroll} className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
                    Enroll Now
                  </button>
                ) : (
                  <button onClick={() => navigate(`/viewlecture/${courseId}`)} className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                    Continue Learning
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Video Player */}
          <div className="lg:w-7/12">
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black flex items-center justify-center">
                {selectedLecture?.videoUrl ? (
                  <video src={selectedLecture.videoUrl} controls className="w-full h-full object-contain" />
                ) : (
                  <div className="text-center p-6 text-white">
                    <FaPlayCircle className="text-5xl mx-auto mb-4 opacity-70" />
                    <p className="text-lg">Select a lecture to start watching</p>
                  </div>
                )}
              </div>

              {selectedLecture && (
                <div className="mt-4">
                  <h2 className="text-xl font-bold mb-2">{selectedLecture.lectureTitle}</h2>
                  <p className="text-gray-600 mb-4">{selectedLecture.description}</p>

                  {selectedLecture.documents?.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedLecture.documents.map((doc, index) => (
                        <a key={index} href={doc.url} target='_blank' download
                           className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-indigo-50">
                          <FaDownload className="text-indigo-600" />
                          <span className="font-medium">{doc.name || `Document ${index+1}`}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Curriculum */}
          <div className="lg:w-5/12">
            <div className="bg-white rounded-xl shadow-md p-5 mb-6">
              <h2 className="text-xl font-bold mb-4">Course Curriculum</h2>
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {selectedCourseData?.lectures?.map((lecture, index) => (
                  <button
                    key={lecture._id}
                    disabled={!lecture.isPreviewFree && !isEnrolled}
                    onClick={() => (lecture.isPreviewFree || isEnrolled) && setSelectedLecture(lecture)}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition ${
                      (lecture.isPreviewFree || isEnrolled) ? 'hover:bg-indigo-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                    } ${selectedLecture?._id === lecture._id ? 'bg-indigo-50 border-l-4 border-indigo-600' : ''}`}
                  >
                    {lecture.isPreviewFree || isEnrolled ? <FaPlayCircle className="text-indigo-600" /> : <FaLock className="text-gray-500" />}
                    <div className="flex-1">
                      <p className="font-medium">{lecture.lectureTitle}</p>
                      <p className="text-xs text-gray-500">{Math.floor(Math.random() * 10 + 5)} min</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Instructor</h2>
              <div className="flex gap-4">
                <img src={creatorData?.photoUrl || img} alt="Instructor" className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-lg">{creatorData?.name || "Instructor"}</h3>
                  <p className="text-gray-600 text-sm">{creatorData?.email}</p>
                  <p className="text-gray-700 mt-2">{creatorData?.description || "Experienced educator"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Student Reviews</h2>
            <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-full">
              <FaStar className="text-yellow-400" />
              <span className="font-bold">{avgRating}</span>
              <span className="text-gray-500">({selectedCourseData?.reviews?.length || 0} reviews)</span>
            </div>
          </div>

          {/* Existing Reviews */}
          <div className="space-y-6">
            {selectedCourseData?.reviews?.slice(0, 3).map((review, index) => (
              <div key={index} className="border-b pb-6 last:border-0 last:pb-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                    {review.user.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-medium">{review.user.name}</h4>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Other Courses by Creator */}
        {selectedCreatorCourse.length > 0 && (
          <div onClick={() => {
            window.scrollTo({ top: 0 });
            setSelectedLecture(null);
            setSelectedCreatorCourse([]);
          }}>
            <h2 className="text-2xl font-bold mb-6">More Courses by {creatorData?.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedCreatorCourse.slice(0, 3).map((course) => (
                <Card
                  key={course._id}
                  thumbnail={course.thumbnail}
                  title={course.title}
                  id={course._id}
                  price={course.price}
                  category={course.category}
                  level={course.level}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}

export default ViewCourse;
