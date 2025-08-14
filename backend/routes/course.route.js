import express from "express";
import { createCourse, editCourse, getCourseById, getCreatorCourses, getPublishedCourses } from "../controller/course.controller";
import isAuth from "../middleware/isAuth";
import upload from "../middleware/multer";

const courseRouter = express.Router();

courseRouter.post("/createcourse",isAuth, createCourse);
courseRouter.get("/getpublished",getPublishedCourses)
courseRouter.get("/getcreator",isAuth, getCreatorCourses)
courseRouter.post("/editcourse/:courseId",isAuth,upload.single("thumbnail"),editCourse)
courseRouter.get("/getcourse/:courseId",isAuth,getCourseById)
courseRouter.delete("/remove/:courseId",isAuth,removeCourse)





export default courseRouter;