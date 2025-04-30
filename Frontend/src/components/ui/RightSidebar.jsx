import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import SuggestedUser from "./SuggestedUser";

const RightSidebar = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="w-fit  my-10 lg:pr-24 xl:pr-36 md:pr-20 sm:hidden md:block transition-all duration-500 ease-in-out ml-3 ">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar className="w-8 h-8">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>
        <div className="">
          <h1 className="font-semibold	text-sm"><Link to={`/profile/${user?._id}`}>{user?.username}</Link></h1>
          <span className="text-gray-500 text-sm">
            {user?.bio}
          </span>
        </div>
      </div>
      <SuggestedUser></SuggestedUser>
    </div>
  );
};

export default RightSidebar;
