import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "../../utils/axios";
import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import Create from "./Create";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { likeNotification } = useSelector((state) => state.rtn);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const sidebarItems = [
    { icon: <Home></Home>, text: "Home" },
    { icon: <Search></Search>, text: "Search" },
    { icon: <TrendingUp></TrendingUp>, text: "Explore" },
    { icon: <MessageCircle></MessageCircle>, text: "Messages" },
    { icon: <Heart></Heart>, text: "Notifications" },
    { icon: <PlusSquare></PlusSquare>, text: "Create" },
    {
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage src={user?.profilePicture} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      text: "Profile",
    },
    { icon: <LogOut></LogOut>, text: "Logout" },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/user/logout", {
        withCredentials: true,
      });
      if (data.success) {
        toast.success("Logout Successfull ");
        dispatch(setAuthUser(null));
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    }
  };
  const createPostHandler = () => {
    setOpen(true);
  };
  const handlers = {
    Home: () => navigate("/"),
    Search: () => navigate("/search"),
    Explore: () => navigate("/"),
    Messages: () => navigate("/chat"),
    Notifications:()=>navigate("/notification"),
    Create: createPostHandler,
    Profile: () => navigate(`/profile/${user?._id}`),
    Logout: logout,
  };

  const sidebarHandler = (type) => {
    const action = handlers[type];
    if (action) return action();
    toast.error("Something went wrong");
  };

  return (
    <div className="lg:w-[300px] sm:w-[230px] h-screen fixed top-0 left-0 z-10 border-r border-gray-400 px-4">
      <div className="flex flex-col">
        <div className="my-6 sm:-ml-6 lg:-ml-20">
          <div
            className="w-40 h-16 mx-auto bg-no-repeat bg-contain"
            style={{
              filter: "brightness(9)",
              backgroundImage: `url("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/512px-Instagram_logo.svg.png")`,
            }}
          ></div>
        </div>

        {sidebarItems.map((item, index) => {
          return (
            <div
              onClick={() => sidebarHandler(item.text)}
              key={index}
              className="relative flex items-center gap-6 p-4 my-2 rounded-lg cursor-pointer hover:bg-gray-600"
            >
              {item.icon}
              <span className="font-medium">{item.text}</span>
              {item.text === "Notifications" && likeNotification.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="absolute w-5 h-5 bg-red-600 rounded-full hover:bg-red-600 bottom-5 left-6 "
                      size="icon"
                    >
                      {likeNotification.length}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64 space-y-2">
                    {likeNotification.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No new Notification
                      </p>
                    ) : (
                      likeNotification.map((notification) => (
                        <div
                          key={notification.userId}
                          className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
                        >
                          <Avatar className="w-8 h-8">
                            <AvatarImage
                              src={notification.userDetails?.profilePicture}
                            />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <p className="text-sm">
                            <span className="font-bold">
                              {notification.userDetails?.username}
                            </span>{" "}
                            liked your post
                          </p>
                        </div>
                      ))
                    )}
                  </PopoverContent>
                </Popover>
              )}
            </div>
          );
        })}
      </div>
      <Create open={open} setOpen={setOpen}></Create>
    </div>
  );
};

export default LeftSidebar;
