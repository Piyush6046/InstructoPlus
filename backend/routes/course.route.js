import express from "express";
import { addDocuments, createCourse, createLectue, editCourse, editLecuture, getCourseById, getCourseLectures, getCreatorCourses, getPublishedCourses, removeCourse, removeLecture } from "../controller/course.controller.js";
import isAuth from "../middleware/isAuth.js";
import upload from "../middleware/multer.js";

const courseRouter = express.Router();

courseRouter.post("/create",isAuth, createCourse);
courseRouter.get("/getpublished",getPublishedCourses)
courseRouter.get("/getcreator",isAuth, getCreatorCourses)
courseRouter.post("/editcourse/:courseId",isAuth,upload.single("thumbnail"),editCourse)
courseRouter.get("/getcourse/:courseId",isAuth,getCourseById)
courseRouter.delete("/remove/:courseId",isAuth,removeCourse)


// for lecture
courseRouter.post("/createlecture/:courseId",isAuth,createLectue)
courseRouter.get("/getlectures/:courseId",isAuth,getCourseLectures)
courseRouter.post("/editlecture/:lectureId",isAuth,upload.single("lecture"),editLecuture)
courseRouter.delete("/removelecture/:lectureId",isAuth,removeLecture)
courseRouter.post("/addDocuments/:lectureId",isAuth,upload.array("documents"),addDocuments)


export default courseRouter;