import React, { useEffect, useState } from "react";
import { Label } from "./label";
import { Input } from "./input";
import { Button } from "./button";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import { persistor } from "@/redux/store";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
const {user}=useSelector(state=>state.auth)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axios.post("/user/login", input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);

        
        await persistor.purge();

        dispatch(setAuthUser(res.data.newuser));

      
        setInput({
          email: "",
          password: "",
        });

        
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
useEffect(()=>{
  if(user) navigate("/")
},[])
  return (
    <div className="flex items-center w-screen min-h-[100dvh] sm:h-screen justify-center bg-[#010100] text-[#FFFEFE]">
      <form
        onSubmit={loginHandler}
        className="shadow-lg flex flex-col gap-5 sm:px-10 sm:py-16 px-8 py-6 w-[370px] sm:border sm:border-gray-600 rounded"
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
          <Label> Email</Label>
          <Input
            className="border border-gray-600 focus-visible:ring-gray-200"
            type="email"
            name="email"
            value={input.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label> Password</Label>
          <Input
            className="mb-4 border border-gray-600 focus-visible:ring-gray-200"
            type="password"
            name="password"
            value={input.password}
            onChange={handleInputChange}
          />
        </div>

        {loading ? (
          <Button disabled>
            <Loader2 className="animate-spin" />
          </Button>
        ) : (
          <Button type="submit" className="font-semibold">
            Log in
          </Button>
        )}

        <div className="flex px-8 py-2 mt-4 -mb-2 text-center">
          <h2>
            Don't have an account?
            <Link to={"/signup"} className="text-[#0194F6] font-semibold">
              {" "}
              Sign in
            </Link>
          </h2>
        </div>
      </form>
    </div>
  );
};

export default Login;
