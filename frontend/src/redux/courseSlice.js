import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
  name: "course",
  initialState: {
    creatorCourseData: [], // Initialize as an empty array
  },
  reducers: {
    setCreatorCourseData: (state, action) => {
      // Ensure payload is an array, otherwise default to an empty array
      state.creatorCourseData = Array.isArray(action.payload) ? action.payload : [];
    },
  },
});

export const { setCreatorCourseData } = courseSlice.actions;
export default courseSlice.reducer;
