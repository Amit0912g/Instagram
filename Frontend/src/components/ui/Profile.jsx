import useGetUserProfile from "@/hooks/useGetUserProfile";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { Badge } from "./badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const { userProfile,user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("posts");
  const [imageLoaded, setImageLoaded] = useState(false);

  const isLoggedInUser = userProfile?._id === user?._id
  const isFollowing = false;
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="xl:pl-32 lg:pl-10 lg:-ml-36 md:pl-5 md:-ml-36  mx-auto flex  ">
      <div className="flex flex-col  gap-16 p-2 w-full">
        <div className="grid grid-cols-2  px-3 py-5">
          <section className="flex items-center  justify-center">
            <Avatar className="w-32 h-32 lg:ml-0 md:ml-5 ml-0">
              <AvatarImage src={userProfile?.profilePicture}></AvatarImage>
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5 md:-ml-14 lg:-ml-24">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">
                  {userProfile?.username}
                </span>
                {isLoggedInUser ? (
                  <>
                    <Link to={"/account/edit"}>
                      <Button
                        variant="secondary"
                        className="hover:bg-gray-200 h-8"
                      >
                        Edit profile
                      </Button>
                    </Link>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      View archive
                    </Button>
                    <Button
                      variant="secondary"
                      className="hover:bg-gray-200 h-8"
                    >
                      Ad tools
                    </Button>
                  </>
                ) : isFollowing ? (
                  <>
                    <Button variant="secondary" className=" ml-5 h-8">
                      Unfollow
                    </Button>
                    <Button variant="secondary" className=" ml-5 h-8">
                      Message
                    </Button>
                  </>
                ) : (
                  <Button className="bg-[#0095f6] hover:bg-[#2a86c4] ml-10 h-8">
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex gap-10 items-center">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}{" "}
                  </span>
                  posts
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.followers.length}{" "}
                  </span>
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following.length}{" "}
                  </span>
                  following
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="font-semibold">{userProfile?.bio}</span>
                <Badge className="w-fit  " variant="secondary">
                  <AtSign className="w-4 h-4"></AtSign>
                  <span className="pl-1">{userProfile?.username}</span>
                </Badge>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-400 ">
          <div className="flex items-center gap-10 justify-center text-sm">
            <span
              onClick={() => handleTabChange("posts")}
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
            >
              POSTS
            </span>
            <span
              onClick={() => handleTabChange("saved")}
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
            >
              SAVED
            </span>
            <span className="py-3 cursor-pointer">REELS</span>
            <span className="py-3 cursor-pointer">TAGGED</span>
          </div>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-1 xl:pl-10 lg:pl-16 md:pl-20 lg:ml-9 xl:ml-0 md:ml-10 overflow-hidden  min-h-[400px]">
  {displayedPost && displayedPost.length > 0 ? (
    displayedPost.map((post) => (
      <div
        key={post?._id}
        className="relative group cursor-pointer overflow-hidden"
      >
        
        {!imageLoaded && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#222121] rounded-sm">
            <div className="w-10 h-10 border-4 border-t-white border-gray-400 rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={post?.image}
          alt="Post_image"
          onLoad={() => setImageLoaded(true)}
          className={`rounded-sm my-2 w-full object-cover aspect-[4/5] overflow-hidden ${
            !imageLoaded ? "invisible" : ""
          }`}
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="flex items-center text-white space-x-4">
            <button className="flex items-center gap-2 hover:text-gray-400">
              <Heart />
              <span>{post?.likes.length}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-gray-400">
              <MessageCircle />
              <span>{post?.comments?.length}</span>
            </button>
          </div>
        </div>
      </div>
    ))
  ) : (
    <div className="flex items-center justify-center col-span-3 py-20">
      <p className="text-gray-500 text-lg">No Saved Posts</p>
    </div>
  )}
</div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
