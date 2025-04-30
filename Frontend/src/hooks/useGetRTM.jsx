import { setMessages } from "@/redux/chatSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
  const { socket } = useSelector((state) => state.socketio);
  const { messages } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      dispatch(setMessages([...messages, newMessage]));
    });

    return ()=>{
        socket?.off('newMessage')
    }
  }, [setMessages, messages]);
};

export default useGetRTM;
