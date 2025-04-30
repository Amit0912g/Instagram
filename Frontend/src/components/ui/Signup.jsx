import React, { useEffect, useState } from "react";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    username: "",
    password: "",
    email: "",
  });
  const {user}=useSelector(state=>state.auth)
  const navigate=useNavigate()
  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
     
      const res = await axios.post("/user/register", input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success("Signup Successfull ");
      }
      setInput({
        username: "",
        password: "",
        email: "",
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  useEffect(()=>{
    if(user) navigate("/")
  },[])
  return (
    <div className="flex items-center w-screen min-h-[100dvh] sm:h-screen  justify-center bg-[#010100] text-[#FFFEFE] ">
      <form
        onSubmit={signupHandler}
        className="shadow-lg flex flex-col gap-5 p-16 w-[370px] sm:w-[400px] sm:border sm:border-gray-600 rounded"
      >
        <div className="my-4">
          <div
            className="w-40 h-16 mx-auto bg-no-repeat bg-contain"
            style={{
              scale: "1.2",
              filter: "brightness(9)",
              backgroundImage: `url("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/512px-Instagram_logo.svg.png")`,
            }}
          ></div>
        </div>
        <div>
          <Label> Username</Label>
          <Input
            className="border border-gray-600 focus-visible:ring-gray-200"
            type="text"
            name="username"
            value={input.username}
            onChange={handleInputChange}
          ></Input>
        </div>
        <div>
          <Label> Email</Label>
          <Input
            className="border border-gray-600 focus-visible:ring-gray-200"
            type="email"
            name="email"
            value={input.email}
            onChange={handleInputChange}
          ></Input>
        </div>
        <div>
          <Label> Password</Label>
          <Input
            className="mb-2 border border-gray-600 focus-visible:ring-gray-200"
            type="password"
            name="password"
            value={input.password}
            onChange={handleInputChange}
          ></Input>
        </div>
        {loading ? (
          <Button>
            <Loader2 className="w-4 h-4 mr-2 animate-spin"></Loader2>
          </Button>
        ) : (
          <Button type="submit" className="font-semibold">
            Sign up
          </Button>
        )}

        <div className="flex px-8 py-2 mt-4 -mb-2 text-center ">
          <h2>
            Have an account?{" "}
            <Link to={"/login"} className="text-[#0194F6] font-semibold">
              Log in
            </Link>
          </h2>
        </div>
      </form>
    </div>
  );
};

export default Signup;
