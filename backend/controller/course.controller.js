import Course from "../model/course.Model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import Lecture from "../model/lecture.Model.js";
import User from "../model/user.Model.js";

export const createCourse = async (req, res) => {
  try {
    const { title, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and category are required",
      });
    }
    const course = await Course.create({
      title,
      creator: req.userId,
      category,
      isPublished: true, // Set isPublished to true by default
    });
    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error while creating course",
      error,
    });
  }
};

export const getPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .populate("creator", "name photoUrl")
      .populate("lectures");
    if (!courses) {
      return res.status(400).json({
        success: false,
        message: "Courses not found",
      });
    }
    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error while getting published courses",
      error,
    });
  }
};

export const getCreatorCourses = async (req, res) => {
  try {
    const userId = req.userId;
    const courses = await Course.find({ creator: userId })
      .populate("creator", "name photoUrl")
      .populate("lectures");
    if (!courses) {
      return res.status(400).json({
        success: false,
        message: "Courses not found",
      });
    }
    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error while getting creator courses",
      error,
    });
  }
};

export const getCreator = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching creator",
      error,
    });
  }
}

export const getCoursesByCreatorId = async (req, res) => {
  try {
    const { creatorId } = req.params;
    const courses = await Course.find({ creator: creatorId, isPublished: true })
      .populate("creator", "name photoUrl")
      .populate("lectures");
    if (!courses) {
      return res.status(404).json({
        success: false,
        message: "Courses not found for this creator",
      });
    }
    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching creator's courses",
      error,
    });
  }
};

export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      title,
      subTitle,
      category,
      description,
      level,
      isPublished,
      price,
    } = req.body;
    let thumbnail;
    if (req.file) {
      thumbnail = await uploadOnCloudinary(req.file.path);
    }
    let course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }
    const updateData = {
      title,
      subTitle,
      category,
      description,
      level,
      isPublished,
      price,
      thumbnail,
    };
    course = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true,
    });
    return res.status(200).json({
      success: true,
      course,
      message: "Course edited successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error while editing course",
      error,
    });
  }
};

export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }
    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error while getting course by id",
      error,
    });
  }
};

export const removeCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    let course = await Course.findById(courseId); // Changed const to let
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "Course not found",
      });
    }
    course = await Course.findByIdAndDelete(courseId);
    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error while deleting course",
      error,
    });
  }
};


// for lecture

export const createLectue= async(req,res)=>{
  try {
    const {courseId}=req.params
    const {lectureTitle}=req.body
    console.log(lectureTitle,courseId);

    if(!lectureTitle || !courseId){
      return res.status(400).json({
        success:false,
        message:"Lecture title and course id are required"
      })
    }
    const lecture=await Lecture.create({
      lectureTitle,
      courseId
    })
    const course=await Course.findById(courseId);
    if(!course){
      return res.status(400).json({
        success:false,
        message:"Course not found"
      })
    }
    course.lectures.push(lecture._id);
    course.populate("lectures");
    await course.save();
    return res.status(200).json({
      success:true,
      lecture
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"error while creating lecture",
      error
    })
  }
}

export const getCourseLectures=async(req,res)=>{
  try {
    const {courseId}=req.params
    const course=await Course.findById(courseId).populate("lectures");
    if(!course){
      return res.status(400).json({
        success:false,
        message:"Course not found"
      })
    }
    await course.save();
    return res.status(200).json({
      success:true,
      course
    })

  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"error while getting course lectures",
      error
    })
  }
}

export const editLecuture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { lectureTitle, description, isPreviewFree, removeVideo } = req.body;
    let { documentInfos, removeDocuments } = req.body;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // Handle video update/removal
    if (req.files && req.files.videoUrl && req.files.videoUrl[0]) {
      const videoResult = await uploadOnCloudinary(req.files.videoUrl[0].path);
      lecture.videoUrl = videoResult;
    } else if (removeVideo === 'true') {
      lecture.videoUrl = null;
    }

    // Handle document removal
    if (removeDocuments) {
      removeDocuments = JSON.parse(removeDocuments);
      if (Array.isArray(removeDocuments) && removeDocuments.length > 0) {
        lecture.documents = lecture.documents.filter(
          (doc) => !removeDocuments.includes(doc._id.toString())
        );
      }
    }

    // Handle new document uploads
    if (documentInfos) {
      documentInfos = JSON.parse(documentInfos);
    }
    if (req.files && req.files.documents && documentInfos) {
      const uploadedDocuments = await Promise.all(
        req.files.documents.map(async (file, index) => {
          const docUrl = await uploadOnCloudinary(file.path);
          const docInfo = documentInfos[index];
          return {
            title: docInfo.title,
            description: docInfo.description,
            url: docUrl,
          };
        })
      );
      lecture.documents.push(...uploadedDocuments);
    }

    // Update other fields
    lecture.lectureTitle = lectureTitle;
    lecture.isPreviewFree = isPreviewFree;
    lecture.description = description;

    await lecture.save();
    return res.status(200).json({
      success: true,
      lecture,
    });
  } catch (error) {
    console.error("Error editing lecture:", error);
    return res.status(500).json({
      success: false,
      message: "Error while editing lecture",
      error: error.message,
    });
  }
};

export const removeLecture=async(req,res)=>{
  try {
    const {lectureId}=req.params
    const lecture=await Lecture.findByIdAndDelete(lectureId);
    if(!lecture){
      return res.status(400).json({
        success:false,
        message:"Lecture not found"
      })
    }
    return res.status(200).json({
      success:true,
      message:"Lecture deleted successfully"
    })
  } catch (error) {
    return res.status(500).json({
      success:false,
      message:"error while deleting lecture",
      error
    })
  }
}
export const addDocuments=async(req,res)=>{
  try{
    const {lectureId}=req.params
    const {documents}=req.body
    const lecture=await Lecture.findById(lectureId);
    if(!lecture){
      return res.status(400).json({
        success:false,
        message:"Lecture not found"
      })
    }

    const savedDocuments=documents.map(async(doc)=>{
      const docUrl=await uploadOnCloudinary(doc.path);
      return {
        title:doc.filename,
        url:docUrl
      }
    })

    const documentsUrl=await Promise.all(savedDocuments);
    lecture.documents.push(...documentsUrl)
    await lecture.save();
    return res.status(200).json({
      success:true,
      lecture
    })
  }catch(error){
    return res.status(500).json({
      success:false,
      message:"error while adding documents",
      error
    })
  }
}
