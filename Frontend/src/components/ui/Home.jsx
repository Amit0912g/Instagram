import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import RightSidebar from "./RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUser from "@/hooks/useGetSuggestedUser";

const Home = () => {
  useGetAllPost()
  useGetSuggestedUser()
  return (
    <div className="flex gap-2 ">
      <div className="flex-grow">
        <Feed></Feed>
        <Outlet />
      </div>
      <RightSidebar></RightSidebar>
    </div>
  );
};

export default Home;
