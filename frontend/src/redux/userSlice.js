import { createSlice } from "@reduxjs/toolkit";

const userlice= createSlice({
  name: "user",
  initialState: {
    userData: null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
  },
});

export const {setUserData} = userlice.actions;
export default userlice.reducer;