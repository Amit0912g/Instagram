import React, { useEffect } from "react";
import { Toaster } from "sonner";
import Routes from "./Routes/appRoutes";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import { setLikeNotification } from "./redux/rtnSlice";
import { setBookmarks } from "./redux/bookmarkSlice";
import axios from "./utils/axios";
const App = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const res = await axios.get("/post/user/bookmarks", {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setBookmarks(res.data.bookmarks)); 
        }
      } catch (error) {
        console.log("Bookmark fetch error", error);
      }
    };
  
    let socketio;
    if (user) {
      fetchBookmarks()
      socketio = io("http://localhost:8000", {
        query: {
          userId: user?._id,
        },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });
      socketio.on("notification",(notification)=>{
        dispatch(setLikeNotification(notification))
      })
    }
    return () => {
      if (socketio) {
        socketio.close();
        dispatch(setSocket(null));
      }
    };
  }, [user, dispatch]);

  return (
    <div>
      <Toaster />
      <Routes />
    </div>
  );
};

export default App;
