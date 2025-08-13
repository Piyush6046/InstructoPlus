import axios from 'axios';
import React, { useEffect } from 'react'
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const getCurrentUser = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser= async () => {
      try {
        const res = await axios.get(serverUrl + "/api/user/getcurrentuser", { withCredentials: true });
        dispatch(setUserData(res.data));
        console.log(res);
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      }
    }
    fetchUser();
  })
  return
}

export default getCurrentUser